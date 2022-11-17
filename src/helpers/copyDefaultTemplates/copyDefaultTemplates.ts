/* eslint-disable new-cap */
import * as vscode from 'vscode';

const copyDefaultTemplates = async (
	extensionPath: string,
	workspaceRoot: string,
) => {
	const extensionUri = vscode.Uri.joinPath(
		vscode.Uri.parse(extensionPath),
		'.templates',
	);
	const workspaceUri = vscode.Uri.joinPath(
		vscode.Uri.parse(workspaceRoot),
		'.templates',
	);

	const templatesExist = vscode.FileSystemError.FileNotFound(workspaceUri);

	if (templatesExist.code !== 'FileNotFound') {
		await vscode.workspace.fs.copy(extensionUri, workspaceUri, {
			overwrite: false,
		});
	}
};

export default copyDefaultTemplates;
