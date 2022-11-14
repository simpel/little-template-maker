import { Buffer } from 'node:buffer';
import * as vscode from 'vscode';
import * as Handlebars from 'handlebars';

import { camelCase, pascalCase } from 'change-case';

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

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.jsnot

	console.log(context);

	const createComponent = vscode.commands.registerCommand(
		'component-templater.createComponent',
		async () => {
			/**
			 * Get the name of the component
			 */
			const componentNameInput = await vscode.window.showInputBox({
				prompt:
					'Enter component name. Will be converted to PascalCase, for example "grid view"/"Grid View" will be converted to "GridView"',
				validateInput(value) {
					if (value === '') {
						return 'Component name cannot be empty';
					}
				},
			});

			if (componentNameInput === undefined) {
				void vscode.window.showErrorMessage('Component name cannot be empty');
				return;
			}

			const componentName = pascalCase(componentNameInput);

			/**
			 * Get the path to the component
			 */

			if (!vscode.workspace.workspaceFile) {
				void vscode.window.showErrorMessage(
					'No workspace folder found. This extension requires a workspace.',
				);
				return;
			}

			const workspaceConfFile = vscode.workspace.workspaceFile.path;
			const workingPath = workspaceConfFile.slice(
				0,
				Math.max(0, workspaceConfFile.lastIndexOf('/')),
			);

			if (!workingPath) {
				void vscode.window.showErrorMessage('No Folder found.');
				return;
			}

			const componentPath = await vscode.window.showOpenDialog({
				canSelectFiles: false,
				canSelectFolders: true,
				canSelectMany: false,
				defaultUri: vscode.Uri.parse(`${workingPath}/src/components`),
				title: 'Select the folder where the component will be created',
			});

			if (componentPath === undefined) {
				void vscode.window.showErrorMessage('Component path cannot be empty');
				return;
			}

			/**
			 * Get additional files
			 */

			const addTypings = await vscode.window.showQuickPick(['Yes', 'No'], {
				placeHolder: `Add typings file? (at ${componentPath.toString()}/${camelCase(
					componentName.toString(),
				)}/T${componentName})`,
			});

			const addStylesFile = await vscode.window.showQuickPick(['Yes', 'No'], {
				placeHolder: `Add file for Styles? (at ${componentPath.toString()}/${camelCase(
					componentName.toString(),
				)}/${componentName}.styles.ts)`,
			});

			await storeFile(
				context,
				'template/component.handlebars',
				componentName,
				vscode.Uri.joinPath(componentPath[0], camelCase(componentName)),
				`${pascalCase(componentName)}.tsx`,
			);

			if (addTypings === 'Yes') {
				await storeFile(
					context,
					'template/type.handlebars',
					componentName,
					vscode.Uri.joinPath(componentPath[0], camelCase(componentName)),
					`T${pascalCase(componentName)}.ts`,
				);
			}

			if (addStylesFile === 'Yes') {
				await storeFile(
					context,
					'template/styles.handlebars',
					componentName,
					vscode.Uri.joinPath(componentPath[0], camelCase(componentName)),
					`${pascalCase(componentName)}.styles.ts`,
				);
			}
		},
	);

	context.subscriptions.push(createComponent);
}
