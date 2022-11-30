import { existsSync } from 'node:fs';
import * as vscode from 'vscode';
import applyTemplate from '../helpers/applyTemplate/applyTemplate';

import assignVariables from '../helpers/assignVariables/assignVariables';
import fetchTemplateVariables from '../helpers/fetchTemplateVariables/fetchTemplateVariables';
import pickDirectory from '../helpers/getDirectories/getDirectories';
import pickTemplate from '../helpers/pickTemplate/pickTemplate';

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

	let pickedDirectory = await pickDirectory(workspace.uri).then((response) => {
		if (response instanceof Error) {
			void vscode.window.showErrorMessage(response.message);
			return;
		}

		return response;
	});

	if (!pickedDirectory) {
		return;
	}

	const folderName = await vscode.window
		.showInputBox({
			title: 'Add optional folder name',
			prompt:
				'If you want to create a new folder for your template, add a name here otherwise just hit Enter',
		})
		.then((response) => {
			return response;
		});

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

	if (folderName !== undefined) {
		pickedDirectory = vscode.Uri.joinPath(pickedDirectory, folderName);
	}

	await applyTemplate(pickedTemplate, pickedDirectory, assignedVariables).then(
		() => {
			void vscode.window.showInformationMessage(
				`Template applied successfully at ${pickedDirectory!.fsPath}`,
			);
		},
	);
};

export default useTemplate;
