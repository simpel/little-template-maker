import * as vscode from 'vscode';
import type { QuickPickItem } from 'vscode';

const pickWorkspace = async (): Promise<string | Error> => {
	return new Promise((resolve, reject) => {
		const workspaces = vscode.workspace.workspaceFolders;

		if (!workspaces) {
			reject(new Error('No workspace found'));
		}

		if (workspaces) {
			if (workspaces.length === 1) {
				resolve(workspaces[0].uri.toString());
			}

			const workspaceUris: QuickPickItem[] = workspaces.map((workspace) => {
				const quickPickItem: QuickPickItem = {
					label: workspace.name,
					detail: workspace.uri.toString(),
				};

				return quickPickItem;
			});

			void vscode.window
				.showQuickPick(workspaceUris, {
					placeHolder: 'Select a workspace',
				})
				.then((workspace) => {
					if (workspace) {
						resolve(workspace.detail!);
					} else {
						reject(new Error('No workspace selected'));
					}
				});
		}
	});
};

export default pickWorkspace;
