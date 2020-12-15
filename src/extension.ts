import * as vscode from "vscode";
import * as fs from "fs";
import * as upath from "upath";

export function activate(context: vscode.ExtensionContext) {
  setNewImage(
    "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1355&q=80"
  );

  const disposable = vscode.commands.registerCommand(
    "extension.setBackgroundImage",
    setNewImage
  );

  context.subscriptions.push(disposable);
}

function setNewImage(image: string) {
  if (!require.main) {
    vscode.window.showErrorMessage(
      "Background.updateCSS: require.main is undefined!"
    );
    return;
  }

  const htmlFile = upath.join("/electron-browser/workbench/workbench.html");

  try {
    const cssStyles = fs
      .readFileSync(upath.resolve(__dirname, "./static/style.css"), "utf-8")
      .replace(/\[BACKGROUND_IMAGE\]/g, image);
    const jsTemplate = fs.readFileSync(
      upath.resolve(__dirname, "./static/template.js"),
      "utf-8"
    );
    const jsTemplateWithCSS = jsTemplate.replace(
      /\[BACKGROUND_STYLES\]/g,
      cssStyles
    );

    const html = fs.readFileSync(htmlFile, "utf-8");

    // add script tag
    let output = html.replace(
      /\<\/html\>/g,
      `<script>${jsTemplateWithCSS}</script>\n`
    );
    output += "</html>";

    fs.writeFileSync(htmlFile, output, "utf-8");

    vscode.window
      .showInformationMessage(
        "Background images enabled. VS code must reload for this change to take effect. Code may display a warning that it is corrupted, this is normal. You can dismiss this message by choosing 'Don't show this again' on the notification.",
        { title: "Restart editor to complete" }
      )
      .then(function () {
        vscode.commands.executeCommand("workbench.action.reloadWindow");
      });
  } catch (e) {
    vscode.window.showErrorMessage(e.message);

    // if (/ENOENT|EACCES|EPERM/.test(e.code)) {
    //   vscode.window.showInformationMessage(
    //     "You must run VS code with admin priviliges in order to enable Neon Dreams."
    //   );
    //   return;
    // } else {
    //   vscode.window.showErrorMessage(
    //     "Something went wrong when starting neon dreams"
    //   );
    //   return;
    // }
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
