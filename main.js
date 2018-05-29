const electron = require('electron');
const {app, globalShortcut} = electron;
const BrowserWindow = electron.BrowserWindow;
const config = require('./config/config');
const path = require('path');

const ioClient = require('socket.io-client');
let socketClient = null;

const socketServer = require('./src/main-process/socket/socket');

const port = process.env.port;


// app life cycle
app.on('ready', () => {
	createIndexWindow();
	globalShortcut.register('CommandOrControl+R', () => {});
});

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	if (indexWindow === null) {
		createIndexWindow();
	}
});



/* index
 ------------------*/

let indexWindow = null;

function createIndexWindow() {
	indexWindow = new BrowserWindow({
		width: 400,
		height: 600,
	});

	indexWindow.loadURL(path.join('file://', __dirname, 'src/windows/index.html'));

	indexWindow.on('closed', function () {
		indexWindow = null;
	});
	//indexWindow.webContents.openDevTools();
}

electron.ipcMain.on('index-window-did-finish-load', (event) => {
	indexWindow.webContents.send('set-port', port)
});


electron.ipcMain.on('open-error-dialog', (event) => {
	electron.dialog.showErrorBox('IP 주소 오류!', '올바른 IP 주소를 입력해주세요.')
});

electron.ipcMain.on('join-game', (event, ip) => {
	socketClient = ioClient.connect('http://' + ip);

	socketClient.on('start-game', function(msg){
		createGameWindow(msg);
	});

	socketClient.emit('join-game');
});

electron.ipcMain.on('create-game', (event) => {
	console.log('on create-game');
	socketServer.initSocketServer();
	socketClient = ioClient.connect('http://127.0.0.1:' + port);

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
	gameWindow = new BrowserWindow({
		width: 840,
		height: 860,
		title: color,
	});

	gameWindow.on('close', () => {
		gameWindow = null;
	});
	gameWindow.loadURL(path.join('file://', __dirname, 'src/windows/game.html'));
	gameWindow.show();

	//gameWindow.openDevTools();
	indexWindow.close();

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
