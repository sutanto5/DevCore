const vscode = require('vscode');
const fetch = require('node-fetch');

function activate(context) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('chatgptView', new ChatGPTViewProvider(context))
  );
}

class ChatGPTViewProvider {
  constructor(context) {
    this._context = context;
  }

  resolveWebviewView(webviewView) {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._context.extensionUri]
    };

    webviewView.webview.html = this.getHtmlForWebview();

    // Listen for messages from the webview
    webviewView.webview.onDidReceiveMessage((message) => {
      if (message.command === 'ask') {
        this.handleChatRequest(message.text);
      }
    });
  }

  getHtmlForWebview() {
    // HTML for the chat interface
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ChatGPT</title>
</head>
<body>
  <div id="chat-container">
    <!-- Chat messages will appear here -->
  </div>
  <input type="text" id="chat-input" placeholder="Ask a tech stack question..." />
  <button id="send">Send</button>
  <script>
    const vscode = acquireVsCodeApi();
    document.getElementById('send').addEventListener('click', () => {
      const input = document.getElementById('chat-input');
      vscode.postMessage({ command: 'ask', text: input.value });
      input.value = '';
    });
  </script>
</body>
</html>`;
  }

  async handleChatRequest(query) {
    const answer = await this.fetchChatGPTAnswer(query);
    this._view.webview.postMessage({ command: 'answer', text: answer });
  }

  async fetchChatGPTAnswer(query) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_API_KEY`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: query }]
        })
      });
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (err) {
      console.error(err);
      return 'Error contacting ChatGPT';
    }
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
