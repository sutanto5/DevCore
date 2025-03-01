const vscode = require('vscode');

class WelcomeViewProvider {
  static viewType = 'welcomeContent';

  constructor(extensionUri) {
    this._extensionUri = extensionUri;
  }

  resolveWebviewView(webviewView, context, _token) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  _getHtmlForWebview(webview) {
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome View</title>
      </head>
      <body>
        <h1>Welcome to Your Extension!</h1>
        <p>This is a custom welcome view in the activity bar.</p>
      </body>
      </html>`;
  }
}

module.exports = WelcomeViewProvider;
