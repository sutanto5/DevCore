from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)

# Replace with your OpenAI API key
client = OpenAI(api_key= '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')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        message = request.json.get('message', '')
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": message}
            ]
        )
        return jsonify({'response': response.choices[0].message.content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)