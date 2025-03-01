const vscode = require('vscode');

class ExtViewProvider {
    constructor(context) {
        this.context = context;
    }

    resolveWebviewView(webviewView, context, token) {
        // Log for debugging purposes
        console.log("ChatGptViewProvider: resolveWebviewView called.");
        webviewView.webview.options = {
            enableScripts: true
        };
        webviewView.webview.html = getWebviewContent();
    }
}

function getWebviewContent() {
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChatGPT Popup</title>
  </head>
  <body>
    <h1>ChatGPT Popup Loaded</h1>
    <p>If you see this, the provider is working!</p>
  </body>
</html>`;
}

function activate(context) {
    console.log("Extension activated.");
    const provider = new ExtViewProvider(context);
    
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider("chatgptsidebar", provider)
    );
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
