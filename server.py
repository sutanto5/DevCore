import os
import openai
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load API key securely from environment variable
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("Error: The OpenAI API key is not set. Please set the OPENAI_API_KEY environment variable.")

openai.api_key = OPENAI_API_KEY

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    prompt = data.get("prompt", "")

    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",  # Or your custom GPT model name
        messages=[{"role": "user", "content": prompt}],
        api_key=OPENAI_API_KEY  # Use the API key from environment
    )

    return jsonify({"response": response["choices"][0]["message"]["content"]})

if __name__ == "__main__":
    app.run(debug=False, port=5000)