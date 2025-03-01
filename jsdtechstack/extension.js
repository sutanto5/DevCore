const vscode = require('vscode');

function activate(context) {

    // Register a command that opens our chat popup.
    let disposable = vscode.commands.registerCommand('extension.openChatPopup', () => {

        // Create and show a new webview panel.
        const panel = vscode.window.createWebviewPanel(

            'chatPopup', // internal identifier
            'ChatGPT Popup', // visible title
            
            vscode.ViewColumn.One, // show in first column
            {
                enableScripts: true  // allow running scripts in the webview
            }
        );

        // Set the HTML content for the webview.
        panel.webview.html = getWebviewContent();

        // Handle messages sent from the webview.
        panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'sendMessage':
                        // Here you can process the user's message (e.g., send it to an API)
                        vscode.window.showInformationMessage('Message received: ' + message.text);
                        return;
                }
            },
            undefined,
            context.subscriptions
        );
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <!-- A basic Content-Security-Policy for our webview -->
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ChatGPT Popup</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 10px; }
    #chat { border: 1px solid #ccc; padding: 10px; height: 300px; overflow-y: auto; }
    #input-container { margin-top: 10px; }
  </style>
</head>
<body>
  <div id="chat">Welcome to ChatGPT!</div>
  <div id="input-container">
      <input type="text" id="message" placeholder="Type your message" style="width:80%;">
      <button onclick="sendMessage()">Send</button>
  </div>
  <script>
      // VS Code provides this function to enable messaging.
      const vscode = acquireVsCodeApi();
      function sendMessage() {
          const input = document.getElementById('message');
          if (input.value) {
              // Append message to the chat area.
              const chat = document.getElementById('chat');
              chat.innerHTML += '<div>You: ' + input.value + '</div>';
              // Send the message to the extension's backend.
              vscode.postMessage({ command: 'sendMessage', text: input.value });
              input.value = '';
          }
      }
  </script>
</body>
</html>`;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
