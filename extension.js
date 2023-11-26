// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cfplugin" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('cfplugin.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Copy the conditions...');

		const editor = vscode.window.activeTextEditor;
		let path = vscode.window.activeTextEditor.document.uri.path;
		const index = path.lastIndexOf('/'); 
		path = path.slice(1, index + 1);
		const filename = editor.document.fileName;
		const selected_text = editor.selection;
		
		const text = editor.document.getText(selected_text);
		// const reverse = text.split('').reverse().join('') + " " + path + " " + filename;
		const spawn = require('child_process').spawn; 
		const data = { 
			link: text,
			save: path 
		}

		let stringifiedData = JSON.stringify(data); 
		const py = spawn('python', [__dirname + '/cf_parser.py', stringifiedData]); 
		resultString = ''; 
		py.stdout.on('data', function (stdData) { 
			resultString += stdData.toString(); 
		});
		py.stdout.on('end', function () { 
  
			// Parse the string as JSON when stdout 
			// data stream ends 
			let resultData = JSON.parse(resultString); 
			
			let answer = resultData['answer']; 
			if (answer == "Ok") {
				vscode.window.showInformationMessage('Successfully!');
			}
			else if (answer == "Not link") {
				vscode.window.showInformationMessage('Select a link, please');
			}
			console.log('Answer =', answer); 
		  });
		// let options = {
		// 	// mode: 'text',
		// 	// pythonOptions: ['-u'],
		// 	scriptPath: '', // Path to script
		// 	args: [text, path]  // arguments
		// };
		
		// let {PythonShell} = require('python-shell')

		// PythonShell.run(__dirname + '/cf_parser.py', options, function (err, result){
		// 	// if (err) console.log(err);
		// 	console.log(err);

		// 	// if (result) console.log('result: ', result);
		// 	// res.send(result.toString())
		// 	console.log('result: ', result);
		// });

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
