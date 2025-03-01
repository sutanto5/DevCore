import os
from openai import OpenAI
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables first
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Create assistant
try:
    assistant = client.beta.assistants.create(
        name="DevCore",
        instructions="""You are a personal developer assistant. Your job is to help the developer set up the environment 
        and make the most ideal environment possible for the given project. You should:
        1. Recommend the best tech stack based on the project requirements
        2. Explain why each technology was chosen
        3. Provide basic setup instructions
        4. Suggest development tools and extensions
        5. Offer best practices for the chosen stack""",
        tools=[{"type": "code_interpreter"}],
        model="gpt-4-turbo-preview",  # Updated model name
    )
except Exception as e:
    print(f"Error creating assistant: {str(e)}")
    assistant = None

# Create thread
try:
    thread = client.beta.threads.create()
except Exception as e:
    print(f"Error creating thread: {str(e)}")
    thread = None

# Initialize Flask app
app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        # Validate input
        data = request.json
        if not data or 'input' not in data:
            return jsonify({"error": "No input provided"}), 400
        
        user_input = data["input"]
        
        # Validate assistant and thread
        if not assistant or not thread:
            return jsonify({"error": "Assistant or thread not initialized"}), 500

        # Create message
        message = client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=user_input
        )

        # Create and run the assistant
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant.id
        )

        # Poll for completion
        while True:
            run_status = client.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id
            )
            if run_status.status == 'completed':
                break
            elif run_status.status in ['failed', 'cancelled', 'expired']:
                return jsonify({"error": f"Run failed with status: {run_status.status}"}), 500

        # Get messages
        messages = client.beta.threads.messages.list(
            thread_id=thread.id
        )

        # Get the latest assistant response
        for msg in messages.data:
            if msg.role == "assistant":
                return jsonify({
                    "response": msg.content[0].text.value,
                    "status": "success"
                })

        return jsonify({"error": "No response from assistant"}), 500

    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)