import * as vscode from 'vscode';
import type { QuickPickItem } from 'vscode';

const pickWorkspace = () => {
	const workspaces = vscode.workspace.workspaceFolders;

	if (!workspaces) {
		return new Error('No workspace found');
	}

	if (workspaces.length === 1) {
		return workspaces[0].uri;
	}

	const workspaceUris: QuickPickItem[] = workspaces.map((workspace) => {
		const quickPickItem: QuickPickItem = {
			label: workspace.name,
			detail: workspace.uri.fsPath,
		};

		return quickPickItem;
	});

	const workspace = vscode.window
		.showQuickPick(workspaceUris, {
			title: 'Select a workspace',
		})
		.then((workspace) => {
			if (workspace?.detail) {
				return vscode.Uri.parse(workspace.detail);
			}

			return new Error('No workspace selected');
		});

	return workspace;
};

export default pickWorkspace;
