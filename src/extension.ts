import { existsSync } from 'node:fs';
import * as vscode from 'vscode';

import assignVariables from './helpers/assignVariables/assignVariables';
import fetchTemplateVariables from './helpers/fetchTemplateVariables/fetchTemplateVariables';
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

			const templatesTargetPath = vscode.Uri.joinPath(
				workspace.uri,
				'.templates',
			);

			const templatesWorkspacePath = vscode.Uri.joinPath(
				vscode.Uri.parse(context.extensionPath),
				'.templates',
			);
			if (!existsSync(templatesTargetPath.fsPath)) {
				await vscode.workspace.fs
					.copy(templatesWorkspacePath, templatesTargetPath, {
						overwrite: false,
					})
					.then((response) => {
						console.log(response);
					});
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
		},
	);

	context.subscriptions.push(ext);
}
