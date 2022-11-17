import * as vscode from 'vscode';
import assignVariables from './helpers/assignVariables/assignVariables';
import copyDefaultTemplates from './helpers/copyDefaultTemplates/copyDefaultTemplates';
import listTemplateVariables from './helpers/listTemplateVariables/listTemplateVariables';
import pickTemplate from './helpers/pickTemplate/pickTemplate';
import pickWorkspace from './helpers/pickWorkspace/pickWorkspace';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	const ext = vscode.commands.registerCommand(
		'simpel.applyTemplate',
		async () => {
			const workspacePath = await pickWorkspace().then((path) => {
				if (!path || path instanceof Error) {
					void vscode.window.showErrorMessage("Couldn't find workspace");
				} else {
					return path;
				}
			});
			if (workspacePath) {
				await copyDefaultTemplates(context.extensionPath, workspacePath);
				const templateFolder = await pickTemplate(workspacePath);
				const { variables, error } = await listTemplateVariables(
					templateFolder,
				);

				if (error) {
					await vscode.window.showErrorMessage(error.message);
					return;
				}

				console.log(variables);

				if (variables.length > 0) {
					await assignVariables(variables).then((values) => {
						console.log('values outside', values);
					});
				} else {
					await vscode.window.showErrorMessage(
						'No variables found in template files',
					);
				}
			}
		},
	);

	context.subscriptions.push(ext);
}
