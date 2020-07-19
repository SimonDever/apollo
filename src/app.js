const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const updater = require('electron-simple-updater');
var vlc = require('./vlc');
const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');
let mainWindow = null;

if (!app.requestSingleInstanceLock()) {
	app.quit()
} else {
	app.on('second-instance', (event, commandLine, workingDirectory) => {
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore()
			mainWindow.focus()
		}
	});

	app.on('window-all-closed', (e) => { /* e.preventDefault(); */ app.quit(); });
	app.on('before-quit', () => { if (mainWindow) { win.removeAllListeners('close'); mainWindow.close(); } });

	// Create myWindow, load the rest of the app, etc...
	app.on('ready', () => {
		
		ipcMain.on('focus-app', () => {
			mainWindow.show();
		});

		/* ipc.on('quit-app', () => {
			e.preventDefault();
			if (mainWindow) mainWindow = null;
			app.quit();
		}); */

		ipcMain.on('play-video', (event, arg) => {
			console.log('play-video action triggered, arg:', arg);
				const player = new vlc(arg);

				player.on('statuschange', (error, status) => {
					if (status) {
						console.log('current time', status.time)
					}
				});
		});

		mainWindow = new BrowserWindow({
			// autoHideMenuBar: true,
			// titleBarStyle: 'hiddenInset',
			// setMenuBarVisibility: true,
			// transparent: true,
			// frame: false
			webPreferences: {
				nodeIntegration: true,
				enableRemoteModule: true
			},
			show: false
		});

		mainWindow.webContents.session.clearCache(function () { })
		
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

		// checkForUpdate();

		fs.exists(`${app.getPath('userData')}\\posters`, (exists) => {
			if (!exists) {
				console.log('Creating poster folder');
				fs.mkdir(`${app.getPath('userData')}\\posters`, (err) => err ? console.log(err) : {});
			}
		});

		mainWindow.loadURL('file://' + __dirname + '/index.html');

		mainWindow.on('ready-to-show', () => {
			mainWindow.show();
			mainWindow.focus();
		});

		mainWindow.on('close', () => {
			mainWindow = null;
		});
	});

	/*
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
	*/
}
