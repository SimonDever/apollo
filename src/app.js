const electron = require('electron');
const path = require('path');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('window-all-closed', function() {
    app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({
		width: 800,
		height: 600
	});

  mainWindow.loadURL('file://' + path.resolve(__dirname) + '/index.html');

  mainWindow.on('closed', function() {
		/* Dereference the window object, usually you would store windows
    in an array if your app supports multi windows, this is the time
		when you should delete the corresponding element.	*/
    mainWindow = null;
  });
});


