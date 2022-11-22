// Bhttps://stackoverflow.com/questions/56583365/async-and-recursive-directory-scan-for-file-listing-in-nodejs-and-expressjs

import * as vscode from 'vscode';

const ignoredDirectories = new Set([
	'node_modules',
	'.git',
	'.vscode',
	'.templates',
]);

const getDirectories = async (
	path: vscode.Uri,
	results: vscode.QuickPickItem[] = [],
) => {
	const filesInDirectory = await vscode.workspace.fs.readDirectory(path);

	// If its the first iteration, add the initial path
	if (results.length === 0) {
		results.push({
			label: path.fsPath,
		});
	}

	const promises = [];

	for (const file of filesInDirectory) {
		const fileUri = vscode.Uri.joinPath(path, file[0]);

		if (
			file[1] === vscode.FileType.Directory &&
			!ignoredDirectories.has(file[0])
		) {
			results.push({
				label: fileUri.fsPath,
			});
			promises.push(getDirectories(fileUri, results));
		}
	}

	await Promise.all(promises);

	return results;
};

export default getDirectories;
