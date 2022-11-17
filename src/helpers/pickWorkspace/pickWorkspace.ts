import * as vscode from 'vscode';
import type { QuickPickItem } from 'vscode';

const pickWorkspace = async (): string | Error => {

		const workspaces = vscode.workspace.workspaceFolders;

		if (!workspaces) {
			return new Error('No workspace found');
		}

		if (workspaces) {
			if (workspaces.length === 1) {
				return workspaces[0].uri.fsPath;
			}

			const workspaceUris: QuickPickItem[] = workspaces.map((workspace) => {
				const quickPickItem: QuickPickItem = {
					label: workspace.name,
					detail: workspace.uri.fsPath,
				};

				return quickPickItem;
			});

			await vscode.window
				.showQuickPick(workspaceUris, {
					placeHolder: 'Select a workspace',
				})
				.then((workspace) => {

					
					if (workspace?.detail) {
						return workspace.detail
					} else {
						return new Error('No workspace selected');
					}
				});
		}
	});
};

export default pickWorkspace;
