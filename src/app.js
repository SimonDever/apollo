/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const electron = require('electron');
const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const path = require('path');
const fs = require('fs');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;

app.on('window-all-closed', function() {
    app.quit();
});

app.on('ready', function() {

	mainWindow = new BrowserWindow({ show: false });

	installExtension(REDUX_DEVTOOLS)
		.then((name) => console.log(`Added Extension:  ${name}`))
		.catch((err) => console.log('An error occurred: ', err));

	mainWindow.webContents.openDevTools();
	mainWindow.webContents.on('devtools-opened', () => {
		setImmediate(() => {
			mainWindow.focus();
		});
	});

	mainWindow.maximize();

	fs.exists("C:\\Users\\Ambrosia\\code\\Apollo\\library-database.json", function (exists) {
		if(exists) {
			console.log('Save file exists.');
		} else {
			console.log('Save file does not exist, creating.');
		}
	});

	mainWindow.loadURL('file://' + path.resolve(__dirname) + '/index.html');

	mainWindow.on('ready-to-show', () => {
		mainWindow.show();
		mainWindow.focus();
	});

  mainWindow.on('closed', function() {
    mainWindow = null;
	});
});
