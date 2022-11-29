import { Buffer } from 'node:buffer';
import * as vscode from 'vscode';
import * as Handlebars from 'handlebars';

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
	const fileTarget = unFilteredPath.slice(0, unFilteredPath.lastIndexOf('.'));

	console.log('TEMPLATE', fileTarget);
	const convertComponent = Handlebars.compile(template.toString());
	const component = convertComponent(variables);

	await vscode.workspace.fs.writeFile(
		vscode.Uri.parse(fileTarget),
		Buffer.from(component),
	);
};

export default storeFile;
