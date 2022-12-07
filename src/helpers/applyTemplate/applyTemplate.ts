import path = require('path');
import * as vscode from 'vscode';
import storeFile from '../storeFile/storeFile';

const applyTemplate = async (
	templateFolder: vscode.Uri,
	targetDirectory: vscode.Uri,
	variables?: Record<string, string>,
) => {

const globPattern = new vscode.RelativePattern(
		templateFolder.path,
		'**/*.handlebars',
	);

	await vscode.workspace
		.findFiles(globPattern)
		.then(async (files) => {
			const storeFilePromises = [];

			for (const file of files) {

				



				storeFilePromises.push(
					storeFile(file, targetDirectory, path.basename(file.fsPath), variables),
				);
			}

			return Promise.all(storeFilePromises).then((response) => {
				return response;
			});
		});
};

export default applyTemplate;
