import * as vscode from 'vscode';

const ignoredDirectories = new Set([
	'node_modules',
	'.git',
	'.vscode',
	'.templates',
]);

const getDirectories = async (workspace: vscode.Uri) => {
	const readDirectory = async (
		directory: vscode.Uri,
	): Promise<vscode.Uri[]> => {
		const files = await vscode.workspace.fs
			.readDirectory(directory)
			.then((files) => {
				return files;
			});

		const directories = [];

		for (const file of files) {
			if (file[1] === vscode.FileType.Directory) {
				directories.push(file[0]);
			}
		}

		const childDirs = Promise.all(
			directories.map(async (dir) => {
				const isBanned = ignoredDirectories.has(dir);
				if (isBanned) {
					return dir;
				}

				const currentDirectory = vscode.Uri.joinPath(directory, dir);

				const currentChildren = await vscode.workspace.fs
					.readDirectory(currentDirectory)
					.then((children) => {
						const currentChildDirectories = [];

						for (const file of children) {
							if (file[1] === vscode.FileType.Directory) {
								currentChildDirectories.push(file[0]);
							}
						}

						return currentChildDirectories;
					});

				console.log('---------------------------');
				console.log(currentDirectory.fsPath);
				console.table(currentChildren);

				if (currentChildren.length > 0) {
					await readDirectory(currentDirectory);
				}

				return dir;
			}),
		).then((list) => {
			console.log('list', list);

			return list;
		});

		return childDirs;
	};

	const returnedList = readDirectory(workspace);
	console.log('returnedList', returnedList);

	return returnedList;
};

export default getDirectories;
