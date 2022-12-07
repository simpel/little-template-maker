import * as fse from 'fs-extra';
import type * as vscode from 'vscode';

const create = async (directory: vscode.Uri) => {
	await fse.mkdirs(directory.fsPath);
};

export default create;
