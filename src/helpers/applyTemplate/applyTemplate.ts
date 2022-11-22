import * as vscode from 'vscode';
import storeFile from '../storeFile/storeFile';

const applyTemplate = async (
	workspace: vscode.Uri,
	templateDirectory: vscode.Uri,
	targetDirectory: vscode.Uri,
	variables?: Record<string, string>,
) => {
	const templateName = templateDirectory.fsPath.split('/').pop();

	await vscode.workspace
		.findFiles(`**/${templateName!}/**/*.handlebars`)
		.then(async (files) => {
			console.log('files', files);

			const storeFilePromises = [];

			for (const file of files) {
				const relativePath = file.fsPath.replace(templateDirectory.fsPath, '');

				console.log(
					'target path for the file:',
					vscode.Uri.joinPath(targetDirectory, relativePath).fsPath,
				);

				storeFilePromises.push(
					storeFile(file, targetDirectory, relativePath, variables),
				);
			}

			return Promise.all(storeFilePromises);
		});
};

export default applyTemplate;
