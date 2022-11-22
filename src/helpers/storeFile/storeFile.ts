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

	const convertComponent = Handlebars.compile(template.toString());
	const component = convertComponent(variables);

	await vscode.workspace.fs.writeFile(
		vscode.Uri.joinPath(targetDirectory, relativePath),
		Buffer.from(component),
	);
};

export default storeFile;
