import * as vscode from 'vscode';

const copyDefaultTemplates = async (
	templates: vscode.Uri,
	workspace: vscode.Uri,
) => {
	const result = vscode.workspace.fs
		.copy(templates, workspace, { overwrite: false })
		.then((response) => {
			return response;
		});

	return result;
};

export default copyDefaultTemplates;
