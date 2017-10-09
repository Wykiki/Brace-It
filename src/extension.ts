'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "brace-it" is now active!');

    vscode.workspace.onDidChangeTextDocument(event => {
        braceIt(event);
    });

    let disposable = vscode.commands.registerCommand('brace-it.yourself', () => {
        vscode.window.showInformationMessage('Hello World!');       
    });

    context.subscriptions.push(disposable);
     
}

export function deactivate() {
}

function braceIt(event: vscode.TextDocumentChangeEvent): void {
    if (!event.contentChanges[0]) {
        return;
    }

    let isSpace = checkSpace(event.contentChanges[0]);
    let isOpenBraces = checkOpenBraces(event.contentChanges[0]);
    if (!isSpace && !isOpenBraces) {
        return;
    }

    let editor = vscode.window.activeTextEditor;
    if (!editor)
        return;

    let originalPosition = editor.selection.start.translate(0, 1);
    let text = editor.document.getText(new vscode.Range(new vscode.Position(0, 0), originalPosition));
    let last2Char = text.substr(text.length - 2);
    if (last2Char === "{ " || last2Char === "{{") {
        editor.edit((editBuilder) => {
            editBuilder.insert(originalPosition, " ");
        }).then(() => {
            editor.selection = moveSelectionLeft(editor.selection, 1);
        });
    }
}

function checkOpenBraces(contentChange: vscode.TextDocumentContentChangeEvent): boolean {
    return contentChange.text.startsWith("{");
}

function checkSpace(contentChange: vscode.TextDocumentContentChangeEvent): boolean {
    return contentChange.text.endsWith(" ");
}

function moveSelectionLeft(selection: vscode.Selection, shift: number): vscode.Selection {
    let newPosition = selection.active.translate(0, -shift);
    let newSelection = new vscode.Selection(newPosition, newPosition);
    return newSelection;
}