import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "background-image" is now active!'
  );

  let disposable = vscode.commands.registerCommand(
    "background-image.helloWorldHiThere",
    () => {
      vscode.window.showErrorMessage(
        "Hello World from background-image!, This is my first VSCode Extension!"
      );
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
