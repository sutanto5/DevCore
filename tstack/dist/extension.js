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
        webviewView.webview.html = this._getHtmlContent();
        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'submitText':
                    this._submittedText = message.text;
                    console.log('Submitted text:', this._submittedText);
                    vscode.window.showInformationMessage(`Text submitted: ${this._submittedText}`);
                    break;
            }
        });
    }
    _getHtmlContent() {
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