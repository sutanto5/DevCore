// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

class WelcomeViewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'tstack-welcome';
	private _view?: vscode.WebviewView;
	private _submittedText: string = '';  // Variable to store the text

	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = this._getHtmlContent();

		// Handle messages from the webview
		webviewView.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'submitText':
						this._submittedText = message.text;
						console.log('Submitted text:', this._submittedText);
						vscode.window.showInformationMessage(`Text submitted: ${this._submittedText}`);
						break;
				}
			}
		);
	}

	private _getHtmlContent() {
		return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome</title>
  <style>
    /* Center content both vertically and horizontally */
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .container {
      padding: 20px;
      font-family: Arial, sans-serif;
      text-align: center;
    }
    .input-group {
      margin-top: 20px;
    }
    .input-group input {
      padding: 10px;
      font-size: 16px;
      width: 250px;
    }
    .input-group button {
      padding: 10px;
      margin-left: 10px;
      border: none;
      background: transparent;
      cursor: pointer;
    }
    .input-group button svg {
      width: 24px;
      height: 24px;
      vertical-align: middle;
    }
     .input-group button:hover {
      background-color: #f0f0f0;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Welcome to TStack!</h2>
    <p>This is your techstack tutor.</p>
    <p>Input a project idea and I will help you get started!</p>
    <form id="textForm">
	<div class="input-group">
      <input type="text" id="textInput" placeholder="Enter your project idea" />
      <button type="submit">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M2 12h20M15 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
	</form>
  </div>
  <script>
    const vscode = acquireVsCodeApi();
    document.getElementById('textForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const text = document.getElementById('textInput').value;
      vscode.postMessage({
        command: 'submitText',
        text: text
      });
      document.getElementById('textInput').value = ''; // Clear the input
    });
  </script>
</body>
</html>

`;
	}

	// Method to get the stored text
	public getSubmittedText(): string {
		return this._submittedText;
	}
}

// This method is called when your extension is activatedopen cursor
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const welcomeProvider = new WelcomeViewProvider(context.extensionUri);
	
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(WelcomeViewProvider.viewType, welcomeProvider)
	);

	console.log('Congratulations, your extension "tstack" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('tstack.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from tstack!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
