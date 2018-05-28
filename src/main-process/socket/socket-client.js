
const ioClient = require('socket.io-client');
let socketClient = null;
//const game = require('../game');

function subscribeGameEvent(game) {
	socketClient.on('start-game', function(msg){
		game.createGameWindow(msg);
	});

	socketClient.on('put-stone', function (msg) {
		game.gameWindow.webContents.send('put-stone', msg);
		console.log("put-stone", msg);
	});
}

function socketConnect(url) {
	socketClient = ioClient.connect(url);
}

function emit(ch, msg) {
	socketClient.emit(ch, msg);
}

module.exports = {
	subscribeGameEvent,
	socketConnect,
	emit
}


