
import * as fse from 'fs-extra';
import * as vscode from 'vscode';

const create = async (
	directory: vscode.Uri,
) => {
	return await fse.mkdirs(directory.fsPath);
};

export default create;
