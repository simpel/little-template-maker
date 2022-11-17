import type { Uri } from 'vscode';
import * as vscode from 'vscode';

const fetchTemplateVariables = async (templateFolder: Uri) => {
	const variableRegEx = new RegExp(/{{{?([a-zA-Z]*)}?}}/, 'mg');
	const variables: string[] = [];

	const globPattern = new vscode.RelativePattern(
		templateFolder,
		'**/*.handlebars',
	);

	const files = await vscode.workspace.findFiles(globPattern);

	const promises = files.map(async (file) => {
		return vscode.workspace.fs.readFile(file);
	});

	const fileContents = await Promise.all(promises);

	for (const content of fileContents) {
		let result;
		while ((result = variableRegEx.exec(content.toString())) !== null) {
			if (result) {
				variables.push(result[1]);
			}
		}
	}

	// Remove duplicates and return as array
	return Array.from(new Set(variables));
};

export default fetchTemplateVariables;
