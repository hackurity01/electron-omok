const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');


let gameWindow = null;
let myColor = null;
const socketClient = require('./socket/socket-client');

function createGameWindow(color) {
	myColor = color;
	gameWindow = new BrowserWindow({width: 400, height: 320});

	gameWindow.on('close', () => {
		gameWindow = null;
	});
	gameWindow.loadURL(path.join('file://', __dirname, '../windows/game.html'));
	gameWindow.show();

	//gameWindow.openDevTools();

}

electron.ipcMain.on('game-window-did-finish-load', (event) => {
	console.log("did finish load");
	gameWindow.webContents.send('set-color', myColor);
});

electron.ipcMain.on('put-stone', (event, msg) => {
	console.log('put-stone', msg, socketClient);
	socketClient.emit('put-stone', msg);
});

module.exports = {
	createGameWindow,
	gameWindow
};
