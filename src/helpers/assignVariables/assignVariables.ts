import * as vscode from 'vscode';

const assignVariables = async (variables: string[]) => {
	/*
	Await vscode.window.showInformationMessage(
		`Found the following variables ${variables.join(', ')}. Let's assign them!`,
	);
*/
	const variableAssignments: Array<Thenable<string | undefined>> = [];

	for (const variable of variables) {
		console.log('variable', variable);

		variableAssignments.push(
			vscode.window.showInputBox({
				title: `Enter a value for ${variable}`,
				validateInput(value) {
					if (!value) {
						return `Please assign ${variable} to a value`;
					}
				},
			}),
		);
	}

	return Promise.all(variableAssignments).then((values) => {
		const assignmentObject: Record<string, string> = {};
		for (const [index, value] of values.entries()) {
			const variableName = /{{(.*?)}}/.exec(variables[index]);
			if (variableName && value) {
				assignmentObject[variableName[1]] = value;
			}
		}

		return assignmentObject;
	});
};

export default assignVariables;
