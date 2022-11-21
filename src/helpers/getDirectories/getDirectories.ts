// Bhttps://stackoverflow.com/questions/56583365/async-and-recursive-directory-scan-for-file-listing-in-nodejs-and-expressjs

import * as vscode from 'vscode';

const ignoredDirectories = new Set([
	'node_modules',
	'.git',
	'.vscode',
	'.templates',
]);

const getDirectories = async (
	workspace: vscode.Uri,
): Promise<vscode.QuickPickItem[]> => {
	const allDirectories: vscode.Uri[] = [];

	const readDirectory = async (
		directory: vscode.Uri,
	): Promise<vscode.Uri[]> => {
		const directories = await vscode.workspace.fs
			.readDirectory(directory)
			.then((files) => {
				const directories: vscode.Uri[] = [];

				for (const file of files) {
					const [fileName, fileType] = file;

					if (
						fileType === vscode.FileType.Directory &&
						!ignoredDirectories.has(fileName)
					) {
						directories.push(vscode.Uri.joinPath(directory, fileName));
					}
				}

				return directories;
			});

		const promises = [];

		console.log('current directory', directory.path, directories.length);

		for (const directory of directories) {
			console.log('directory', directory.path);
			promises.push(readDirectory(directory));
		}

		if (promises.length === 0) {
			allDirectories.push(directory);
			return allDirectories;
		}

		return Promise.all(promises).then((results) => {
			console.log('results', results);
			return results.flat();
		});
	};

	const returnedList = await readDirectory(workspace).then((directories) => {
		return directories;
	});
	return returnedList.map((directory) => {
		return {
			label: directory.path,
			detail: directory.fsPath,
		};
	});
};

export default getDirectories;
