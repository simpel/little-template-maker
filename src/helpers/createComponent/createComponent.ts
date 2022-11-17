import { camelCase, pascalCase } from 'change-case';
import * as vscode from 'vscode';
import storeFile from '../storeFile/storeFile';

const createComponent = async (context: vscode.ExtensionContext) => {
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
};

export default createComponent;
