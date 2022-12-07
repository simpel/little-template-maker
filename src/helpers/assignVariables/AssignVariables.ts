import * as vscode from 'vscode';

const assignVariables = async (variables: string[]) => {
	const variableAssignments: Record<string, string> = {};

	while (variables.length > 0) {
		try {
			/**
			 * Selected variableName
			 */
			// eslint-disable-next-line no-await-in-loop
			const selectedVariableName = await vscode.window.showQuickPick(
				variables,
				{
					title: `${variables.length} variables left to assign`,
					placeHolder: 'Select a variable to assign',
				},
			);

			if (selectedVariableName === undefined) {
				return;
			}

			/**
			 * Input value by user
			 */
			// eslint-disable-next-line no-await-in-loop
			const selectedVariableValue = await vscode.window.showInputBox({
				prompt: `Input a value for "{{${selectedVariableName}}}"`,
				validateInput(value) {
					if (value === '') {
						return 'You must assign the template variable to a value so it can be replaced.';
					}

					return '';
				},
			});

			if (selectedVariableName === undefined) {
				return;
			}

			variableAssignments[selectedVariableName] = selectedVariableValue!;
			variables.splice(variables.indexOf(selectedVariableName), 1);
		} catch {
			break;
		}
	}

	return variableAssignments;
};

export default assignVariables;
