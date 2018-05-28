const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

const port = process.env.port;

let indexWindow = null;

const socketServer = require('./socket/socket');
const socketClient = require('./socket/socket-client');
const game = require('./game');

function createIndexWindow() {
	indexWindow = new BrowserWindow({
		width: 400,
		minWidth: 400,
		maxWidth: 400,
		height: 600,
		minHeight: 600,
		maxHeight: 600,
	});

	indexWindow.loadURL(path.join('file://', __dirname, '../windows/index.html'));

	indexWindow.on('closed', function () {
		indexWindow = null;
	});
}

electron.ipcMain.on('open-error-dialog', (event) => {
	electron.dialog.showErrorBox('IP 주소 오류!', '올바른 IP 주소를 입력해주세요.')
});

electron.ipcMain.on('join-game', (event, ip) => {
	socketClient.socketConnect('http://' + ip);
	socketClient.subscribeGameEvent(game);
	socketClient.emit('join-game');
});

electron.ipcMain.on('create-game', (event) => {
	console.log('on create-game');
	socketServer.initSocketServer();
	socketClient.socketConnect('http://127.0.0.1:' + port);
	socketClient.subscribeGameEvent(game);
	socketClient.emit('create-game');
});

module.exports = {
	indexWindow,
	createIndexWindow
};