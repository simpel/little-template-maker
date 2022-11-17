import { Buffer } from 'node:buffer';
import * as vscode from 'vscode';
import * as Handlebars from 'handlebars';

const storeFile = async (
	context: vscode.ExtensionContext,
	componentTemplate: string,
	templateReplacementToken: string,
	destinationFolder: vscode.Uri,
	fileName: string,
) => {
	const template = await vscode.workspace.fs.readFile(
		vscode.Uri.joinPath(context.extensionUri, componentTemplate),
	);

	const convertComponent = Handlebars.compile(template.toString());
	const component = convertComponent({
		componentName: templateReplacementToken,
	});

	await vscode.workspace.fs.writeFile(
		vscode.Uri.joinPath(destinationFolder, fileName),
		Buffer.from(component),
	);
};

export default storeFile;
