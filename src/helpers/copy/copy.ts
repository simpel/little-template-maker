
import * as fse from 'fs-extra';
import * as vscode from 'vscode';

const copy = async (
	templates: vscode.Uri,
	workspace: vscode.Uri,
) => {
	return await fse.copy(templates.fsPath, workspace.fsPath);
};

export default copy;
