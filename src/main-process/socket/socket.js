const port = process.env.port;


// For Socket.io
const express = require('express')();
const http = require('http').Server(express);
const io = require('socket.io')(http);
const config = require('../../../config/config');

http.listen(port, function(){
	console.log('listening on' + port);
});

let Game = require('../game/game').Game;
let game = null;
let waiting = false;


/* Socket Server
 -------------------*/
function initSocketServer() {
	io.on('connection', function (socket) {
		console.log('connected', socket.id);

		socket.on('disconnect', function () {
			console.log('user disconnected');
		});

		socket.on('create-game', function () {
			game = new Game(config.BOARD_SIZE);
			game.setPlayer('white', socket.id);
			waiting = true;
		});

		socket.on('join-game', function () {
			if(waiting) {
				waiting = false;
				game.setPlayer('black', socket.id);
				io.to(game.getPlayer('black')).emit('start-game', 'black');
				io.to(game.getPlayer('white')).emit('start-game', 'white');
			}
		});

		socket.on('put-stone', function (msg) {
			console.log('put-stone', msg);
			game.putStone({x: msg.x, y: msg.y}, msg.color);
			let result = game.checkWin();
			msg.result = result;
			io.sockets.emit('put-stone', msg);

			//gameWindow.webContents.send('turn-start', msg);
		});
	});
	console.log('created socket server');
}

module.exports = {
	initSocketServer
};