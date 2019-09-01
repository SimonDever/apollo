/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
const electron = require('electron');
const path = require('path');
const fs = require('fs');

const {
	default: installExtension,
	REDUX_DEVTOOLS
} = require('electron-devtools-installer');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;

app.on('window-all-closed', () => {
	app.quit();
});

app.on('ready', () => {

	let displays = electron.screen.getAllDisplays()
  let externalDisplay = displays.find(display => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  });

	console.log(`externalDisplay:`, externalDisplay);

  if (externalDisplay) {
		mainWindow = new BrowserWindow({
			show: false,
			x: externalDisplay.bounds.x + 50,
			y: externalDisplay.bounds.y + 50
		});
	} else {
		mainWindow = new BrowserWindow({
			show: false
		});
	}

	mainWindow.webContents.session.clearCache(function(){})

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

	fs.exists("./library-database.json", (exists) => {
		if (exists) {
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

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
});
