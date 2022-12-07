import * as vscode from 'vscode';
import * as fs from 'fs';


import applyTemplate from '../helpers/applyTemplate/applyTemplate';

import assignVariables from '../helpers/assignVariables/assignVariables';
import fetchTemplateVariables from '../helpers/fetchTemplateVariables/fetchTemplateVariables';
import pickDirectory from '../helpers/getDirectories/getDirectories';
import pickTemplate from '../helpers/pickTemplate/pickTemplate';
import copyAndCreate from '../helpers/copy/copy';
import create from '../helpers/create/create';
import copy from '../helpers/copy/copy';

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

	const templatesExist = fs.existsSync(templatesTargetPath.fsPath);

	console.log('hasTemplates', templatesExist);
	

	if (!templatesExist) {

			// create template directory
		await create(templatesTargetPath);

		console.log("CREATED TEMPLATES DIR");
		

		await copy(templatesWorkspacePath, templatesTargetPath);

		console.log("COPIED TEMPLATES DIR");
		
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

	console.log("PICKED TEMPLATE", pickedTemplate.fsPath);
	

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

	console.log("pickedDirectory", pickedDirectory);


	const templateVariables = await fetchTemplateVariables(pickedTemplate).then(
		(response) => {
			if (response instanceof Error) { return void vscode.window.showErrorMessage(response.message); }
			return response;
		},
	);

	console.log("templateVariables", templateVariables);
	

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

	console.log("assignedVariables", assignedVariables);

	await create(pickedDirectory);
	await applyTemplate(pickedTemplate, pickedDirectory, assignedVariables).then(
		() => {
			void vscode.window.showInformationMessage(
				`Template applied successfully at ${pickedDirectory!.fsPath}`,
			);
		},
	);
};

export default useTemplate;
