import * as vscode from 'vscode';

const pickTemplate = async (
	workspacePath: string,
): Promise<vscode.Uri | undefined> => {
	const templateDirs = await vscode.workspace.fs.readDirectory(
		vscode.Uri.joinPath(vscode.Uri.file(workspacePath), '.templates'),
	);

	const templatesItems: vscode.QuickPickItem[] = templateDirs.map(
		(templateDir) => {
			const item: vscode.QuickPickItem = {
				label: templateDir[0],
				description:
					templateDir[1] === vscode.FileType.Directory ? 'Directory' : 'File',
			};

			return item;
		},
	);

	return vscode.window
		.showQuickPick(templatesItems, {
			canPickMany: false,
			title: 'Select a template',
		})
		.then(async (template) => {
			if (template?.label) {
				return vscode.Uri.joinPath(
					vscode.Uri.parse(workspacePath),
					'.templates',
					template.label,
				);
			}

			await vscode.window.showErrorMessage('No template selected');
		});
};

export default pickTemplate;
