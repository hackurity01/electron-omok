const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const config = require('./config/config');

const path = require('path');
const url = require('url');


const ioClient = require('socket.io-client');
let socketClient = null;

//const socketClient = require('./src/main-process/socket/socket-client');
const socketServer = require('./src/main-process/socket/socket');
//import * as ioClient from 'socket.io-client';

const port = process.env.port;



// app life cycle
app.on('ready', createWindow);

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	if (indexWindow === null) {
		createWindow();
	}
});


// main-process import
//const index = require('./src/main-process/index');
//const game = require('./src/main-process/game');


function createWindow() {
	createIndexWindow();

/*	electron.ipcMain.on('create-window', (event, msg) => {
		switch (msg) {
			case 'game':
				game.createGameWindow();
				break;
			default:
				return;
		}
	});*/

}


/* index
 ------------------*/

let indexWindow = null;

function createIndexWindow() {
	indexWindow = new BrowserWindow({
		width: 400,
		minWidth: 400,
		maxWidth: 400,
		height: 600,
		minHeight: 600,
		maxHeight: 600,
	});

	indexWindow.loadURL(path.join('file://', __dirname, 'src/windows/index.html'));

	indexWindow.on('closed', function () {
		indexWindow = null;
	});
}

electron.ipcMain.on('open-error-dialog', (event) => {
	electron.dialog.showErrorBox('IP 주소 오류!', '올바른 IP 주소를 입력해주세요.')
});

electron.ipcMain.on('join-game', (event, ip) => {
	socketConnect('http://' + ip);

	//socketClient.subscribeGameEvent(game);
	socketClient.on('start-game', function(msg){
		createGameWindow(msg);
	});

	socketClient.emit('join-game');
});

electron.ipcMain.on('create-game', (event) => {
	console.log('on create-game');
	socketServer.initSocketServer();
	socketConnect('http://127.0.0.1:' + port);

	//socketClient.subscribeGameEvent(game);
	socketClient.on('start-game', function(msg){
		createGameWindow(msg);
	});

	socketClient.emit('create-game');
});



/* game
 ------------------*/

let gameWindow = null;
let myColor = null;

function createGameWindow(color) {
	myColor = color;
	gameWindow = new BrowserWindow({width: 400, height: 320});

	gameWindow.on('close', () => {
		gameWindow = null;
	});
	gameWindow.loadURL(path.join('file://', __dirname, 'src/windows/game.html'));
	gameWindow.show();

	gameWindow.openDevTools();

	socketClient.on('put-stone', function (msg) {
		gameWindow.webContents.send('put-stone', msg);
		console.log("put-stone", msg);
	});
}

electron.ipcMain.on('game-window-did-finish-load', (event) => {
	console.log("did finish load");
	gameWindow.webContents.send('set-color', myColor);
	gameWindow.webContents.send('set-board', config.BOARD_SIZE);
});

electron.ipcMain.on('put-stone', (event, msg) => {
	console.log('put-stone', msg, socketClient);
	socketClient.emit('put-stone', msg);
});






function socketConnect(url) {
	socketClient = ioClient.connect(url);
}