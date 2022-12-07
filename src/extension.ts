import * as vscode from 'vscode';
import useTemplate from './useTemplate/UseTemplate';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand(
		'littletemplatemaker.useTemplate',
		() => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			void useTemplate(context);
		},
	);

	context.subscriptions.push(disposable);
}
