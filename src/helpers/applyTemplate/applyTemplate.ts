import * as vscode from 'vscode';
import storeFile from '../storeFile/storeFile';

const applyTemplate = async (
	templateDirectory: vscode.Uri,
	targetDirectory: vscode.Uri,
	variables?: Record<string, string>,
) => {
	const templateName = templateDirectory.fsPath.split('/').pop();

	await vscode.workspace
		.findFiles(`**/${templateName!}/**/*.handlebars`)
		.then(async (files) => {
			const storeFilePromises = [];

			for (const file of files) {
				const relativePath = file.fsPath.replace(templateDirectory.fsPath, '');

				storeFilePromises.push(
					storeFile(file, targetDirectory, relativePath, variables),
				);
			}

			return Promise.all(storeFilePromises).then((response) => {
				return response;
			});
		});
};

export default applyTemplate;
