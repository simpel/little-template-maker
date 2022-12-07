import * as fs from 'node:fs';
import * as vscode from 'vscode';

import applyTemplate from '../helpers/applyTemplate/ApplyTemplate';

import assignVariables from '../helpers/assignVariables/AssignVariables';
import fetchTemplateVariables from '../helpers/fetchTemplateVariables/FetchTemplateVariables';
import pickDirectory from '../helpers/getDirectories/GetDirectories';
import pickTemplate from '../helpers/pickTemplate/PickTemplate';
import create from '../helpers/create/Create';
import copy from '../helpers/copy/Copy';

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

	const hasTemplates = fs.existsSync(templatesTargetPath.fsPath);

	if (!hasTemplates) {
		// Create template directory
		await create(templatesTargetPath);
		await copy(templatesWorkspacePath, templatesTargetPath);
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
		async (response) => {
			if (response instanceof Error) {
				await vscode.window.showErrorMessage(response.message);
				return [];
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

	await create(pickedDirectory);
	await applyTemplate(pickedTemplate, pickedDirectory, assignedVariables).then(
		() => {
			void vscode.window.showInformationMessage(
				`Template applied successfully at ${pickedDirectory.fsPath}`,
			);
		},
	);
};

export default useTemplate;
