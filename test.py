from flask import Flask, request, jsonify
from openai import OpenAI
from openai.error import RateLimitError
import backoff
import logging
import os
from dotenv import load_dotenv
import sys

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Get API key from environment variables
api_key = os.environ.get('OPENAI_API_KEY')
if not api_key:
    logger.error("Error: OPENAI_API_KEY not found in environment variables")
    sys.exit(1)

app = Flask(__name__)

# Initialize OpenAI client with API key from environment
client = OpenAI(
    api_key=api_key
)

# Implement exponential backoff for OpenAI API calls
@backoff.on_exception(backoff.expo, RateLimitError)
def chat_completion_with_backoff(**kwargs):
    logger.debug("Making API call with backoff...")
    return client.chat.completions.create(**kwargs)

@app.after_request
def after_request(response):
    # Enable CORS
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    return response

@app.route('/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    try:
        data = request.json
        user_message = data.get('message', '')
        
        # Log the received message
        logger.debug(f"Received message: {user_message}")
        logger.debug(f"Using API key: {api_key[:8]}...")  # Only log first 8 chars for security

        # Use the backoff-enabled function
        completion = chat_completion_with_backoff(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are a helpful tech stack advisor."},
                {"role": "user", "content": user_message}
            ]
        )

        response = completion.choices[0].message.content
        
        # Log the response
        logger.debug(f"GPT Response: {response[:100]}...")  # Log first 100 chars
        
        return jsonify({"response": response})

    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error processing request: {error_msg}")
        return jsonify({"error": error_msg}), 500

if __name__ == '__main__':
    logger.info(f"Starting server on port 5001")
    logger.info(f"Using OpenAI API key: {api_key[:8]}...")  # Only log first 8 chars
    app.run(port=5001, debug=True)
