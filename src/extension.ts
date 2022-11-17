import * as vscode from 'vscode';
import assignVariables from './helpers/assignVariables/assignVariables';
import fetchTemplateVariables from './helpers/getchTemplateVariables/fetchTemplateVariables';
import pickTemplate from './helpers/pickTemplate/pickTemplate';

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

			const pickedTemplate: vscode.Uri | undefined = await pickTemplate(
				workspace,
			).then((path) => {
				if (path?.detail) {
					return vscode.Uri.parse(path.detail);
				}

				void vscode.window.showErrorMessage("Couldn't find any templates");
			});

			const templateVariables = await fetchTemplateVariables(
				pickedTemplate!,
			).then((variables) => {
				if (variables) {
					return variables;
				}

				void vscode.window.showErrorMessage("Couldn't find template variables");
			});

			if (!templateVariables) {
				return;
			}

			const assignedVariables = await assignVariables(templateVariables).then(
				(response) => {
					return response;
				},
			);

			console.log('assigned', assignedVariables);
		},
	);

	context.subscriptions.push(ext);
}
