import * as vscode from 'vscode';
import type { QuickPickItem } from 'vscode';

const pickWorkspace = async (): Promise<Uri | Error> => {
	const workspaces = vscode.workspace.workspaceFolders;

	if (!workspaces) {
		return new Error('No workspace found');
	}

	if (workspaces) {
		if (workspaces.length === 1) {
			return workspaces[0].uri;
		}

		const workspaceUris: QuickPickItem[] = workspaces.map(
			(workspace, index) => {
				const quickPickItem: QuickPickItem = {
					label: workspace.name,
					detail: index,
				};

				return quickPickItem;
			},
		);

		await vscode.window
			.showInputBox({
				title: 'Select a workspace',
			})
			.then((workspace) => {
				return workspace?.detail
					? workspaces[workspace.detail].uri
					: new Error('No workspace selected');
			});
	}
};

export default pickWorkspace;
