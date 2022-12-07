import { Buffer } from 'node:buffer';
import * as vscode from 'vscode';
import * as Handlebars from 'handlebars';
import * as fs from 'fs-extra';

const storeFile = async (
	templateFile: vscode.Uri,
	targetDirectory: vscode.Uri,
	relativePath: string,
	variables?: Record<string, string>,
) => {
	const template = await vscode.workspace.fs.readFile(templateFile);

	const unFilteredPath = vscode.Uri.joinPath(
		targetDirectory,
		relativePath,
	).fsPath;

	//remove .handlebars from file name
	const fileTarget = unFilteredPath.slice(0, unFilteredPath.lastIndexOf('.'));

	const convertComponent = Handlebars.compile(template.toString());
	const component = convertComponent(variables);


	await fs.writeFile(
		fileTarget,
		component

	);
};

export default storeFile;
