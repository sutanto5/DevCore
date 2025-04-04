/**{
    "name": "jsdtechstack",
    "displayName": "JSDTechStack",
    "version": "0.0.1",
    "engines": {
      "vscode": "^1.97.0"
    },
    "activationEvents": [
    ],
    "main": "./extension.js",
    "contributes": {
      "viewsWelcome": [{
        "view": "scm",
        "contents": "In order to use git features, you can open a folder containing a git repository or clone from a URL.\n[Open Folder](command:vscode.openFolder)\n[Clone Repository](command:git.clone)\nTo learn more about how to use git and source control in VS Code [read our docs](https://aka.ms/vscode-scm).",
          "when": "config.git.enabled && git.state == initialized && workbenchState == empty"
        }
      ],
      "viewsContainers": {
        "activitybar": [
          {
            "id": "chatgptSidebar",
            "title": "ChatGPT",
            "icon": "resources/Wrench Icon.png"
          }
        ]
      },
      "views": {
        "chatgptSidebar": [
          {
            "id": "chatgptView",
            "name": "ChatGPT"
          }
        ]
      }
    },
    "scripts": {
      "lint": "eslint .",
      "pretest": "npm run lint",
      "test": "vscode-test"
    },
    "devDependencies": {
      "@types/vscode": "^1.97.0",
      "@types/node": "20.x",
      "eslint": "^9.19.0"
    }
  }
  **/