import type { Uri } from 'vscode';
import * as vscode from 'vscode';

const fetchTemplateVariables = async (templateFolder: Uri) => {
	const variableRegEx = new RegExp(/{{{?([a-zA-Z]*)}?}}/, 'mg');
	const variables: string[] = [];


	console.log('variableRegEx', variableRegEx);


	const globPattern = new vscode.RelativePattern(
		templateFolder.path,
		'**/*.handlebars',
	);

	console.log('globPattern', globPattern.baseUri.path, globPattern.baseUri.fsPath);
	

	const files = await vscode.workspace.findFiles(globPattern).then((files) => {
		console.log('thenfiles', files);
		return files;
	});

console.log('files', files);


	const promises = files.map(async (file) => {
		return vscode.workspace.fs.readFile(file);
	});

	const fileContents = await Promise.all(promises);

	console.log("fileContents", fileContents);
	

	for (const content of fileContents) {
		let result;
		while ((result = variableRegEx.exec(content.toString())) !== null) {
			if (result) {
				variables.push(result[1]);
			}
		}
	}

	if (variables.length === 0) {
		return new Error('No variables found in template');
	}

	return Array.from(new Set(variables));
};

export default fetchTemplateVariables;
