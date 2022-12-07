import * as vscode from 'vscode';

const pickTemplate = async (workspace: vscode.WorkspaceFolder) => {
	const templateDirs = await vscode.workspace.fs
		.readDirectory(vscode.Uri.joinPath(workspace.uri, '.templates'))
		.then((response) => {
			return response;
		});

	const templatesList: vscode.QuickPickItem[] = templateDirs.map(
		(templateDir) => {
			const item: vscode.QuickPickItem = {
				label: templateDir[0],
				detail: vscode.Uri.joinPath(workspace.uri, '.templates', templateDir[0])
					.fsPath,
			};

			return item;
		},
	);

	return vscode.window
		.showQuickPick(templatesList, {
			canPickMany: false,
			title: 'Select a template',
		})
		.then((template) => {
			if (template?.detail) {
				return vscode.Uri.parse(template.detail);
			}

			return new Error('Please pick a template');
		});
};

export default pickTemplate;
