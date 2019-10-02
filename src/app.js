const electron = require('electron');
const { dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const updater = require('electron-simple-updater');
/* const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer'); */
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow = null;

const ipc = require('electron').ipcMain;

app.requestSingleInstanceLock();
app.on('window-all-closed', app.quit);
app.on('before-quit', () => { if (mainWindow) mainWindow.close(); });
app.on('ready', () => {
	let displays = electron.screen.getAllDisplays();
  let externalDisplay = displays.find(display => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  });

	ipc.on('focus-app', () => {
		mainWindow.show();
	});

	ipc.on('quit-app', () => {
		if (mainWindow) mainWindow = null;
		app.quit();
	});

	console.log(`externalDisplay:`, externalDisplay);

  if (externalDisplay) {
		mainWindow = new BrowserWindow({
			//autoHideMenuBar: true,
			//titleBarStyle: 'hiddenInset',
			webPreferences: {
				nodeIntegration: true
			},
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

	/*
	installExtension(REDUX_DEVTOOLS)
		.then((name) => console.log(`Added Extension:  ${name}`))
		.catch((err) => console.log('An error occurred: ', err));
	mainWindow.webContents.openDevTools();
 */

	mainWindow.webContents.on('devtools-opened', () => {
		setImmediate(() => {
			mainWindow.focus();
		});
	});

	mainWindow.maximize();

	checkForUpdate();

	fs.exists(`${app.getPath('userData')}\\posters`, (exists) => {
		if (!exists) {
			console.log('Creating poster folder');
			fs.mkdir(`${app.getPath('userData')}\\posters`, (err) => err ? console.log(err) : {});
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

function checkForUpdate() {

	console.log('checkForUpdate() running');

	updater.init({
		checkUpdateOnStart: true,
		autoDownload: false,
		disabled: false,
		logger: {
			info(text) { console.log('info', text) },
			warn(text) { console.log('warn', text) },
		}
	});

	updater.disabled = false;

	updater.on('update-available', (meta) => {
		console.log('onUpdateAvailable - meta', meta);

		const options = {
			type: 'question',
			buttons: ['Quit', 'Skip update', 'Update'],
			defaultId: 3,
			title: 'Update available',
			message: 'Would you like to update to the latest version? I might come with shiny new features and certainly less bugs. ' + meta,
			detail: 'It does not really matter',
			checkboxLabel: 'Remember my answer',
			checkboxChecked: true,
		};

		dialog.showMessageBox(null, options, (response, checkboxChecked) => {
			console.log(response);
			console.log(checkboxChecked);
			updater.setOptions('autoDownload', checkboxChecked);
			// updater.checkForUpdates();
			// updater.quitAndInstall();
			// updater.downloadUpdate();
		});
	});

	updater.on('update-downloading', () => {
		console.log('onUpdateDownloading');
	});

	updater.on('update-downloaded', () => {
		if (confirm('The app has been updated. Do you like to restart it now?')) {
			updater.quitAndInstall();
		}
	});

	// updater.checkForUpdates();

}
