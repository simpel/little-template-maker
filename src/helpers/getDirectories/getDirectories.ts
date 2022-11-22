// Bhttps://stackoverflow.com/questions/56583365/async-and-recursive-directory-scan-for-file-listing-in-nodejs-and-expressjs

import * as vscode from 'vscode';

const ignoredDirectories = new Set([
	'node_modules',
	'.git',
	'.vscode',
	'.templates',
]);

const iterateDirectories = async (
	path: vscode.Uri,
	results: vscode.Uri[] = [],
) => {
	const filesInDirectory = await vscode.workspace.fs.readDirectory(path);

	// If its the first iteration, add the initial path
	if (results.length === 0) {
		results.push(path);
	}

	const promises = [];

	for (const file of filesInDirectory) {
		const fileUri = vscode.Uri.joinPath(path, file[0]);

		if (
			file[1] === vscode.FileType.Directory &&
			!ignoredDirectories.has(file[0])
		) {
			results.push(fileUri);
			promises.push(iterateDirectories(fileUri, results));
		}
	}

	await Promise.all(promises);

	return results;
};

const pickDirectory = async (path: vscode.Uri) => {
	const quickPickItems = await iterateDirectories(path).then((paths) => {
		const quickPickItems = paths.map((directory) => {
			return {
				label: directory.fsPath,
			};
		});

		return quickPickItems;
	});

	const pickedDirectory = await vscode.window
		.showQuickPick(quickPickItems, {
			title: 'Pick a directory',
		})
		.then((directory) => {
			if (directory?.label) {
				return vscode.Uri.parse(directory.label);
			}

			return new Error('Please pick a directory');
		});

	return pickedDirectory;
};

export default pickDirectory;
