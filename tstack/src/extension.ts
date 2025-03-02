import 'dotenv/config';
import * as vscode from 'vscode';
import { OpenAI } from 'openai';

let openai: OpenAI;

async function initializeOpenAI() {
	const apiKey = vscode.workspace.getConfiguration('devcore').get('openaiApiKey');
	if (!apiKey) {
		const response = await vscode.window.showInformationMessage(
			'OpenAI API key is not set. Would you like to set it now?',
			'Yes',
			'No'
		);
		if (response === 'Yes') {
			await setApiKey();
		}
		return false;
	}
	
	openai = new OpenAI({
		apiKey: apiKey as string
	});
	return true;
}

async function setApiKey() {
	const apiKey = await vscode.window.showInputBox({
		prompt: 'Enter your OpenAI API key',
		password: true,
		placeHolder: 'sk-...'
	});

	if (apiKey) {
		await vscode.workspace.getConfiguration('devcore').update('openaiApiKey', apiKey, true);
		vscode.window.showInformationMessage('API key has been saved');
		openai = new OpenAI({ apiKey });
		return true;
	}
	return false;
}

class WelcomeViewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'devcore-welcome';
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

		webviewView.webview.html = this._getHtmlContent(webviewView.webview);

		// Handle messages from the webview
		webviewView.webview.onDidReceiveMessage(
			async message => {
				switch (message.command) {
					case 'submit':
						try {
							// Show loading state
							webviewView.webview.postMessage({
								command: 'response',
								text: 'Loading...'
							});

							// Call OpenAI API directly
							const completion = await openai.chat.completions.create({
								model: "gpt-3.5-turbo",
								messages: [
									{ role: "system", content: "You are a helpful tech stack advisor." },
									{ role: "user", content: message.text }
								]
							});

							const response = completion.choices[0].message.content;

							webviewView.webview.postMessage({
								command: 'response',
								text: response || 'No response received'
							});

						} catch (error) {
							console.error('Error:', error);
							let errorMessage = 'An unknown error occurred.';
							
							if (error instanceof Error) {
								if (error.message.includes('429')) {
									errorMessage = 'API quota exceeded. Please:\n' +
										'1. Check your OpenAI account billing status at https://platform.openai.com/account/billing\n' +
										'2. Make sure you have a valid payment method\n' +
										'3. Consider upgrading your plan if needed';
									
									const response = await vscode.window.showInformationMessage(
										'Would you like to update your API key?',
										'Yes',
										'No'
									);
									if (response === 'Yes') {
										await setApiKey();
									}
								} else {
									errorMessage = `Error: ${error.message}`;
								}
							}

							webviewView.webview.postMessage({
								command: 'response',
								text: errorMessage
							});
						}
						break;
				}
			},
			undefined,
			[]
		);
	}

	private _getHtmlContent(webview: vscode.Webview): string {
		return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>DevCore</title>
	<style>
		:root {
			--accent-color: #3794FF;
			--bg-color: var(--vscode-editor-background);
			--text-color: var(--vscode-foreground);
		}

		body {
			padding: 20px;
			color: var(--text-color);
			font-family: var(--vscode-font-family);
			background: var(--bg-color);
		}

		h1 {
			font-size: 24px;
			margin-bottom: 24px;
		}

		h2 {
			font-size: 20px;
			margin-bottom: 16px;
		}

		.instruction-block {
			border-left: 3px solid var(--accent-color);
			padding-left: 16px;
			margin-bottom: 24px;
		}

		.step {
			margin-bottom: 16px;
		}

		.step-title {
			color: var(--accent-color);
			font-weight: 600;
			margin-bottom: 8px;
		}

		.step-description {
			color: var(--text-color);
			opacity: 0.9;
		}

		.input-container {
			margin-top: 24px;
			display: flex;
			gap: 8px;
		}

		input {
			flex: 1;
			padding: 8px 12px;
			background: var(--vscode-input-background);
			color: var(--vscode-input-foreground);
			border: 1px solid var(--vscode-input-border);
			border-radius: 4px;
		}

		button {
			padding: 8px 16px;
			background: var(--accent-color);
			color: white;
			border: none;
			border-radius: 4px;
			cursor: pointer;
		}

		button:hover {
			opacity: 0.9;
		}

		.chat-container {
			margin-top: 20px;
			max-height: 60vh;
			overflow-y: auto;
		}

		.message {
			margin-bottom: 16px;
			padding: 12px;
			border-radius: 4px;
			background: var(--vscode-input-background);
		}

		.response {
			border-left: 3px solid var(--accent-color);
		}
	</style>
</head>
<body>
	<h1>Welcome to DevCore!</h1>
	
	<div class="instruction-block">
		<h2>How to Use DevCore:</h2>

		<div class="step">
			<div class="step-title">Input Your OpenAI API key:</div>
			<div class="step-description">Enter Cmd+ShiftP in the search bar and type in DevCore:OpenAI API Key, there input your api key</div>
		</div>
		
		<div class="step">
			<div class="step-title">Describe Your Project:</div>
			<div class="step-description">Enter a brief description of what you want to build (e.g., "I want to create a social media app for photographers")</div>
		</div>
		
		<div class="step">
			<div class="step-title">Get Recommendations:</div>
			<div class="step-description">DevCore will analyze your needs and suggest the best tech stack</div>
		</div>
		
		<div class="step">
			<div class="step-title">Receive Guidance:</div>
			<div class="step-description">Get detailed explanations of why each technology was chosen and how to set them up</div>
		</div>
		
		<div class="step">
			<div class="step-title">Best Practices:</div>
			<div class="step-description">Learn about development tools, extensions, and industry best practices for your stack</div>
		</div>
	</div>

	<div class="input-container">
		<input 
			type="text" 
			id="messageInput" 
			placeholder="Describe your project idea here..."
		/>
		<button id="sendButton">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="22" y1="2" x2="11" y2="13"></line>
				<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
			</svg>
		</button>
	</div>

	<div class="chat-container" id="chatContainer"></div>

	<script>
		const vscode = acquireVsCodeApi();
		const chatContainer = document.getElementById('chatContainer');
		const messageInput = document.getElementById('messageInput');
		const sendButton = document.getElementById('sendButton');
		
		function addMessage(text, isResponse = false) {
			const messageDiv = document.createElement('div');
			messageDiv.className = \`message \${isResponse ? 'response' : ''}\`;
			messageDiv.textContent = text;
			chatContainer.appendChild(messageDiv);
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
		
		function handleSubmit() {
			const text = messageInput.value.trim();
			if (!text) return;
			
			addMessage(text);
			messageInput.value = '';
			
			vscode.postMessage({
				command: 'submit',
				text: text
			});
		}
		
		messageInput.addEventListener('keypress', (e) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault();
				handleSubmit();
			}
		});
		
		sendButton.addEventListener('click', handleSubmit);
		
		window.addEventListener('message', event => {
			const message = event.data;
			switch (message.command) {
				case 'response':
					if (message.text !== 'Loading...') {
						addMessage(message.text, true);
					}
					break;
			}
		});
	</script>
</body>
</html>`;
	}

	// Method to get the stored text
	public getSubmittedText(): string {
		return this._submittedText;
	}
}

// Add interface for error response
interface ErrorResponse {
	error?: string;
}

// Add interface for the response data
interface ChatResponse {
	response?: string;
	error?: string;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Register the set API key command
	context.subscriptions.push(
		vscode.commands.registerCommand('devcore.setApiKey', setApiKey)
	);

	// Initialize OpenAI
	initializeOpenAI();

	const welcomeProvider = new WelcomeViewProvider(context.extensionUri);
	
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(WelcomeViewProvider.viewType, welcomeProvider)
	);

	console.log('DevCore extension is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('devcore.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello from DevCore!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {
	// Clean up if needed
}
