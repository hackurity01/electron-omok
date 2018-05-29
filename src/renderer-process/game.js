const {ipcRenderer} = require('electron');
const thisWindow = require('electron').remote.getCurrentWindow()
const whiteStone = '<div class="white-stone"></div>';
const blackStone = '<div class="black-stone"></div>';
let myColor = '';
let myStone = '', opponentStone = '';

let turn = false;

createBoard();


function createBoard(size) {
	let lineTable = document.createElement('table');
	lineTable.setAttribute('class', 'line');
	for(let i=0; i<size; i++) {
		let lineTr = lineTable.insertRow();
		for(let j=0; j<size; j++) {
			lineTr.insertCell();
		}
	}

	let boardTable = document.createElement('table');
	boardTable.setAttribute('class', 'board');
	for(let i=0; i<size+1; i++) {
		let boardTr = boardTable.insertRow();
		for(let j=0; j<size+1; j++) {
			let boardTd = boardTr.insertCell();
			boardTd.setAttribute('id', 'pos-' + j + i);
			boardTd.setAttribute('data-x', j.toString());
			boardTd.setAttribute('data-y', i.toString());
		}
	}

	document.querySelector('.table-wrapper').appendChild(lineTable);
	document.querySelector('.table-wrapper').appendChild(boardTable);

	// event binding

	let cell = document.querySelectorAll('.board td');
	Array.from(cell).forEach(function (el) {
		el.addEventListener('click', function () {
			if (turn) {
				turn = false;
				if (this.innerHTML.trim() !== '') {
					return;
				}

				ipcRenderer.send('put-stone', {x: this.dataset.x, y: this.dataset.y, color: myColor});
			} else {
				alert('상대방의 차례입니다.');
			}
		});
	});
}

function win(color) {
	let text = (color === 'black' ? "흑돌" : "백돌") + " 승";
	//alert((color === 'black' ? "흑돌" : "백돌") + " 승");
	document.querySelector('#dim').style.display = 'block';
	document.querySelector('#dim .dim-title').innerHTML = text;
}

/* IPC
-------------- */
document.addEventListener("DOMContentLoaded", function(event) {
	ipcRenderer.send('game-window-did-finish-load');
});
ipcRenderer.on('set-color', (event, color) => {
	myColor = color;
	console.log('on set-color', myColor);
	if(myStone === '') {
		if(myColor === 'black') {
			myStone = blackStone;
			opponentStone = whiteStone;
			turn = true;
		} else {
			myStone = whiteStone;
			opponentStone = blackStone;
			turn = false;
		}
	}
});

ipcRenderer.on('set-board', (event, size) => {
	createBoard(size);
});

ipcRenderer.on('put-stone', (event, msg) => {
	if(myColor === msg.color){
		//ipcRenderer.send('noti-my-turn', myColor);
		turn = false;
	} else {
		turn = true;

		const myNotification = new window.Notification(myColor + ", It's your turn.");

		myNotification.onclick = () => {
			thisWindow.focus()
		}
	}

	document.querySelector('#pos-' + msg.x + msg.y).innerHTML = (msg.color === 'black' ? blackStone : whiteStone);

	if(msg.result !== 0) {
		win(msg.result);
	}
});