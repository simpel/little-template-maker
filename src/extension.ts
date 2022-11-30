import { existsSync } from 'node:fs';
import * as vscode from 'vscode';

import assignVariables from './helpers/assignVariables/assignVariables';
import fetchTemplateVariables from './helpers/fetchTemplateVariables/fetchTemplateVariables';
import pickDirectory from './helpers/getDirectories/getDirectories';
import pickTemplate from './helpers/pickTemplate/pickTemplate';
import applyTemplate from './helpers/applyTemplate/applyTemplate';

const useTemplate = async (context: vscode.ExtensionContext) => {
	const workspace = vscode.workspace.workspaceFolders
		? vscode.workspace.workspaceFolders[0]
		: undefined;
	if (!workspace) {
		void vscode.window.showErrorMessage("Couldn't find workspace");
		return;
	}

	const templatesTargetPath = vscode.Uri.joinPath(workspace.uri, '.templates');

	const templatesWorkspacePath = vscode.Uri.joinPath(
		vscode.Uri.parse(context.extensionPath),
		'.templates',
	);
	if (!existsSync(templatesTargetPath.fsPath)) {
		await vscode.workspace.fs.copy(
			templatesWorkspacePath,
			templatesTargetPath,
			{
				overwrite: false,
			},
		);
	}

	const pickedTemplate = await pickTemplate(workspace).then((response) => {
		if (response instanceof Error) {
			void vscode.window.showErrorMessage(response.message);
			return;
		}

		return response;
	});

	if (!pickedTemplate) {
		return;
	}

	const pickedDirectory = await pickDirectory(workspace.uri).then(
		(response) => {
			if (response instanceof Error) {
				void vscode.window.showErrorMessage(response.message);
				return;
			}

			return response;
		},
	);

	if (!pickedDirectory) {
		return;
	}

	const templateVariables = await fetchTemplateVariables(pickedTemplate).then(
		(response) => {
			if (response instanceof Error) {
				void vscode.window.showErrorMessage(response.message);
				return;
			}

			return response;
		},
	);

	let assignedVariables;
	if (templateVariables) {
		assignedVariables = await assignVariables(templateVariables).then(
			(response) => {
				if (response instanceof Error) {
					void vscode.window.showErrorMessage(response.message);
					return;
				}

				return response;
			},
		);
	}

	await applyTemplate(
		workspace.uri,
		pickedTemplate,
		pickedDirectory,
		assignedVariables,
	).then(() => {
		void vscode.window.showInformationMessage(
			`Template applied successfully at ${pickedDirectory.fsPath}`,
		);
	});
};

export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log(
		'Congratulations, your extension "littletemplatemaker" is now active!',
	);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
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
