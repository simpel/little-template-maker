/* eslint-disable no-async-promise-executor */
import type { Uri } from 'vscode';
import * as vscode from 'vscode';

type TResponse = {
	variables: string[];
	error: Error | undefined;
};

const listTemplateVariables = async (templateFolder?: Uri) => {
	if (!templateFolder) {
		return {
			variables: [],
			error: new Error('No template folder provided'),
		};
	}

	return new Promise<TResponse>(async (resolve, reject) => {
		const globPattern = new vscode.RelativePattern(
			templateFolder,
			'**/*.handlebars',
		);

		const fileReads: Array<Thenable<Uint8Array>> = [];

		await vscode.workspace.findFiles(globPattern).then(async (uris) => {
			if (uris.length > 0) {
				for (const uri of uris) {
					fileReads.push(vscode.workspace.fs.readFile(uri));
				}
			} else {
				resolve({
					variables: [],
					error: new Error('No files found'),
				});
			}
		});

		Promise.all(fileReads)
			.then(async (files) => {
				let contentOfAllFiles = '';

				for (const file of files) {
					contentOfAllFiles += file.toString();
				}

				const matches = /{{{?[a-zA-Z]*}?}}/.exec(contentOfAllFiles);

				console.log(matches?.length);

				if (matches) {
					const templateVariables = matches.map((match) => {
						return match.toString();
					});

					resolve({
						variables: templateVariables,
						error: undefined,
					});
				} else {
					resolve({
						variables: [],
						error: new Error('No variables found in template files'),
					});
				}
			})
			.catch((error: Error) => {
				reject(new Error(error.message));
			});
	});
};

export default listTemplateVariables;
