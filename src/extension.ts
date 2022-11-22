import * as vscode from 'vscode';

import assignVariables from './helpers/assignVariables/assignVariables';
import fetchTemplateVariables from './helpers/getchTemplateVariables/fetchTemplateVariables';
import pickDirectory from './helpers/getDirectories/getDirectories';
import pickTemplate from './helpers/pickTemplate/pickTemplate';
import applyTemplate from './helpers/applyTemplate/applyTemplate';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	const ext = vscode.commands.registerCommand(
		'simpel.applyTemplate',
		async () => {
			const workspace = vscode.workspace.workspaceFolders
				? vscode.workspace.workspaceFolders[0]
				: undefined;
			if (!workspace) {
				void vscode.window.showErrorMessage("Couldn't find workspace");
				return;
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

			console.log('pickedURI', pickedTemplate);

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

			const templateVariables = await fetchTemplateVariables(
				pickedTemplate,
			).then((response) => {
				if (response instanceof Error) {
					void vscode.window.showErrorMessage(response.message);
					return;
				}

				return response;
			});

			let assignedVariables;
			if (templateVariables) {
				assignedVariables = await assignVariables(templateVariables).then(
					(response) => {
						console.log('assignVariables response', response);

						if (response instanceof Error) {
							void vscode.window.showErrorMessage(response.message);
							return;
						}

						return response;
					},
				);
			}

			await applyTemplate(
				workspace,
				pickedTemplate,
				pickedDirectory,
				assignedVariables,
			);
		},
	);

	context.subscriptions.push(ext);
}
