import http.server
import socketserver
import json
from openai import OpenAI
import os
from dotenv import load_dotenv
import sys

# Load environment variables
load_dotenv()

# Get API key with explicit environment variable
api_key = os.environ.get('OPENAI_API_KEY')
if not api_key:
    print("Error: OPENAI_API_KEY not found in environment variables", file=sys.stderr)
    sys.exit(1)

# Initialize OpenAI client with explicit API key
client = OpenAI(
    api_key=api_key
)

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        try:
            # Enable CORS
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Content-type', 'application/json')
            self.end_headers()

            # Get request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            message = data.get('message', '')

            print(f"Received message: {message}")  # Debug print
            print(f"Using API key: {api_key[:8]}...")  # Debug print first 8 chars

            # Get response from OpenAI
            completion = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful tech stack advisor."},
                    {"role": "user", "content": message}
                ]
            )
            response_text = completion.choices[0].message.content
            print(f"Got response from OpenAI: {response_text[:50]}...")  # Debug print
            
            # Send response
            self.wfile.write(json.dumps({'response': response_text}).encode())
        except Exception as e:
            print(f"Error in request: {str(e)}", file=sys.stderr)
            self.wfile.write(json.dumps({'error': str(e)}).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

# Start server
PORT = 5001
print(f"Starting server on port {PORT}")
print(f"Using OpenAI API key: {api_key[:8]}...")  # Debug print first 8 chars

with socketserver.TCPServer(("", PORT), RequestHandler) as httpd:
    print("Server is running...")
    httpd.serve_forever()