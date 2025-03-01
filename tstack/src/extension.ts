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
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');

    /* Root Theme Variables */
    :root {
      --bg-color: var(--vscode-editor-background);
      --text-color: var(--vscode-foreground);
      --container-bg: var(--vscode-sideBar-background);
      --border-color: var(--vscode-panel-border);
      --button-bg: var(--vscode-button-background);
      --button-hover: var(--vscode-button-hoverBackground);
      --input-bg: var(--vscode-input-background);
      --input-text: var(--vscode-input-foreground);
      --input-border: var(--vscode-input-border);
      --description-bg: var(--vscode-textBlockQuote-background);
    }

    /* Dark Mode Variables */
    @media (prefers-color-scheme: dark) {
      :root {
        --bg-color: #121212;
        --text-color: #e0e0e0;
        --container-bg: #1e1e1e;
        --border-color: #333;
        --button-bg: #0a84ff;
        --button-hover: #0070d1;
        --input-bg: #252525;
        --input-text: #e0e0e0;
      }
    }

    /* Base Styles */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: var(--vscode-font-family);
      transition: all 0.2s ease-in-out;
    }

    body {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      padding: 10px;
      height: 100vh;
      background: transparent;
      color: var(--text-color);
      font-size: var(--vscode-font-size);
      line-height: 1.4;
    }

    .container {
      background: transparent;
      padding: 10px;
      text-align: left;
      width: 100%;
    }

    h2 {
      color: var(--vscode-titleBar-activeForeground);
      font-weight: 600;
      margin-bottom: 15px;
      font-size: 1.2em;
    }

    .description {
      color: var(--text-color);
      font-size: 13px;
      line-height: 1.5;
      margin-bottom: 20px;
      padding: 12px;
      background: var(--description-bg);
      border-left: 3px solid var(--vscode-textLink-foreground);
      border-radius: 3px;
    }

    .description h3 {
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--vscode-titleBar-activeForeground);
    }

    .description ul {
      margin-left: 20px;
      margin-top: 8px;
    }

    .description li {
      margin-bottom: 6px;
    }

    .description strong {
      color: var(--vscode-textLink-foreground);
      font-weight: 500;
    }

    .input-group {
      display: flex;
      align-items: center;
      border: 1px solid var(--input-border);
      border-radius: 2px;
      overflow: hidden;
      background: var(--input-bg);
      margin-top: 15px;
    }

    .input-group input {
      flex: 1;
      border: none;
      padding: 8px 10px;
      font-size: 13px;
      outline: none;
      background: var(--input-bg);
      color: var(--input-text);
      min-height: 32px;
      font-family: var(--vscode-font-family);
    }

    .input-group input::placeholder {
      color: var(--vscode-input-placeholderForeground);
    }

    .input-group button {
      border: none;
      background: var(--button-bg);
      color: var(--vscode-button-foreground);
      padding: 4px 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s ease;
      min-width: 28px;
      height: 32px;
    }

    .input-group button:hover {
      background: var(--button-hover);
    }

    .input-group button svg {
      width: 16px;
      height: 16px;
      stroke: currentColor;
    }

  </style>
</head>
<body>
  <div class="container">
    <h2>Welcome to DevCore!</h2>
    
    <div class="description">
      <h3>How to Use DevCore:</h3>
      <ul>
        <li><strong>Describe Your Project:</strong> Enter a brief description of what you want to build (e.g., "I want to create a social media app for photographers")</li>
        <li><strong>Get Recommendations:</strong> DevCore will analyze your needs and suggest the best tech stack</li>
        <li><strong>Receive Guidance:</strong> Get detailed explanations of why each technology was chosen and how to set them up</li>
        <li><strong>Best Practices:</strong> Learn about development tools, extensions, and industry best practices for your stack</li>
      </ul>
    </div>
    
    <form id="textForm">
      <div class="input-group">
        <input 
          type="text" 
          id="textInput" 
          placeholder="Describe your project idea here..."
        />
        <button type="submit" title="Get Recommendations">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M15 6l6 6-6 6"/>
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
