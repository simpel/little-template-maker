import * as fse from 'fs-extra';
import type * as vscode from 'vscode';

const copy = async (templates: vscode.Uri, workspace: vscode.Uri) => {
	await fse.copy(templates.fsPath, workspace.fsPath);
};

export default copy;
