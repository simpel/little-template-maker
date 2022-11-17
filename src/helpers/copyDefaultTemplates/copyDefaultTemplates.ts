import * as vscode from 'vscode';

const copyDefaultTemplates = async (
	extensionPath: string,
	workspaceRoot: string,
): Promise<string | Error> => {
	return await vscode.workspace.fs
		.copy(extensionUri, workspaceUri, {
			overwrite: false,
		})
		.then(async () => {
			return workspaceUri;
		})
		.catch(async (error: Error) => {
			throw new Error(error.message);
		});
};

export default copyDefaultTemplates;
