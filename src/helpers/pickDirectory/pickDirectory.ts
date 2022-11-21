import * as vscode from 'vscode';

const pickDirectory = async () => {
	const allFiles: Set<vscode.QuickPickItem> = await vscode.workspace
		.findFiles('**/*', '**/node_modules/**')
		.then((files) => {
			const quickPickItems = new Set<vscode.QuickPickItem>();

			for (const file of files) {
				quickPickItems.add({
					label: file.path,
					detail: file.fsPath,
				});
			}

			return quickPickItems;
		});

	console.log('allFiles', allFiles);

	const pickedDirectory = await vscode.window
		.showQuickPick([...allFiles], {
			canPickMany: false,
			matchOnDetail: true,
			title: 'Select a directory',
		})
		.then((item) => {
			if (item?.detail) {
				return vscode.Uri.parse(item.detail);
			}

			return undefined;
		});

	return pickedDirectory;
};

export default pickDirectory;
