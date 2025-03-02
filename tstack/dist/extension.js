/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(__webpack_require__(1));
class WelcomeViewProvider {
    _extensionUri;
    static viewType = 'tstack-welcome';
    _view;
    _submittedText = ''; // Variable to store the text
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };
        webviewView.webview.html = this._getHtmlContent(webviewView.webview);
        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case 'submit':
                    try {
                        // Show loading state
                        webviewView.webview.postMessage({
                            command: 'response',
                            text: 'Loading...'
                        });
                        // Simple fetch request
                        const response = await fetch('http://localhost:5001/chat', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ message: message.text })
                        });
                        // Get response as text first
                        const responseText = await response.text();
                        try {
                            // Try to parse as JSON
                            const data = JSON.parse(responseText);
                            webviewView.webview.postMessage({
                                command: 'response',
                                text: data.response || data.error || 'No response received'
                            });
                        }
                        catch {
                            // If JSON parsing fails, show the raw text
                            webviewView.webview.postMessage({
                                command: 'response',
                                text: responseText
                            });
                        }
                    }
                    catch (error) {
                        console.error('Error:', error);
                        webviewView.webview.postMessage({
                            command: 'response',
                            text: 'Error connecting to server. Please make sure:\n1. The Python server is running\n2. Your OpenAI API key is set correctly'
                        });
                    }
                    break;
            }
        }, undefined, []);
    }
    _getHtmlContent(webview) {
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

    /* Add styles for the response container */
    .response-container {
      margin-top: 20px;
      padding: 12px;
      background: var(--description-bg);
      border-left: 3px solid var(--vscode-textLink-foreground);
      border-radius: 3px;
      color: var(--text-color);
      font-size: 13px;
      line-height: 1.5;
      white-space: pre-wrap;
      display: none; /* Hidden by default */
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
    
    <div class="input-group">
      <input type="text" id="userInput" placeholder="Describe your project idea...">
      <button id="submitButton">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </button>
    </div>

    <!-- Add response container -->
    <div id="responseContainer" class="response-container"></div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    const submitButton = document.getElementById('submitButton');
    const userInput = document.getElementById('userInput');
    const responseContainer = document.getElementById('responseContainer');

    submitButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });

    function sendMessage() {
      const text = userInput.value.trim();
      if (text) {
        responseContainer.style.display = 'block';
        responseContainer.textContent = 'Loading...';
        vscode.postMessage({ command: 'submit', text });
      }
    }

    window.addEventListener('message', event => {
      const message = event.data;
      switch (message.command) {
        case 'response':
          responseContainer.style.display = 'block';
          responseContainer.textContent = message.text;
          break;
      }
    });
  </script>
</body>
</html>
`;
    }
    // Method to get the stored text
    getSubmittedText() {
        return this._submittedText;
    }
}
// This method is called when your extension is activatedopen cursor
// Your extension is activated the very first time the command is executed
function activate(context) {
    const welcomeProvider = new WelcomeViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(WelcomeViewProvider.viewType, welcomeProvider));
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
function deactivate() { }


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map