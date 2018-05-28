const config = require('../../../config/config');

/*
 * 0 : 빈 공간
 * 1 : 흑 돌
 * 2 : 흰 돌
 */
class Game {
	constructor(size) {
		this.size = size;
		this.board = [...Array(size)].map(x => new Array(size).fill(0));
		//this.myColor = color;
		//this.opponentColor = (color === 1 ? 2 : 1);
		this.player = {'black': null, 'white': null};
	}

	getColor(c) {
		return this.color;
	}
	setColor(color) {
		this.color = color;
	}

	setPlayer(color, id) {
		this.player[color] = id;
	}
	getPlayer(color) {
		return this.player[color];
	}

	putStone(pos, color) {
		console.log(this.board);
		this.board[pos.x][pos.y] = color;
	}

	checkWin() {
		let board = this.board;
		let color = 0;
		let count = 0;
		let goal = 3;
		let x = 0, y = 0;

		console.log(1);
		for(y=0; y<this.size; y++) {
			count = 0;
			color = 0;
			for(let x=0; x<this.size; x++) {
				if(board[x][y] === 0) {
					color = 0;
					count = 0;
				} else if(board[x][y] === color) {
					count++;
				} else {
					count = 1;
					color = board[x][y];
				}

				if(count === goal) {
					return color;
				}
			}
		}

		console.log(2);
		for(x=0; x<this.size; x++) {
			count = 0;
			color = 0;
			for(let y=0; y<this.size; y++) {
				if(board[x][y] === 0) {
					color = 0;
					count = 0;
				} else if(board[x][y] === color) {
					count++;
				} else {
					count = 1;
					color = board[x][y];
				}

				if(count === goal) {
					return color;
				}
			}
		}

		console.log(3);
		// 오른쪽 위로 대각선 검사
		x = 0;
		y = 0;
		count = 0;
		color = 0;
		while(1) {
			console.log(x,y);
			if(board[x][y] === 0) {
				color = 0;
				count = 0;
			} else if(board[x][y] === color) {
				count++;
			} else {
				count = 1;
				color = board[x][y];
			}

			if(count === goal) {
				return color;
			}

			x++;
			y--;

			if (x >= this.size) {
				x = y + 2;
				y = this.size - 1;
			} else if (y < 0) {
				y = x;
				x = 0;
			}

			if(x === this.size - 1 && y === this.size - 1)
				break;
		}


		console.log(4);

		// 오른쪽 아래로 대각선 검사
		x = this.size - 1;
		y = 0;
		count = 0;
		color = 0;
		while(1) {
			if(board[x][y] === 0) {
				color = 0;
				count = 0;
			} else if(board[x][y] === color) {
				count++;
			} else {
				count = 1;
				color = board[x][y];
			}

			if(count === goal) {
				return color;
			}

			x++;
			y++;

			if (y >= this.size) {
				y = this.size - x + 1;
				x = 0;
			} else if (x >= this.size) {
				x = this.size - y - 1;
				y = 0;
			}

			if(x === 0 && y === this.size - 1)
				break;
		}

		return 0;
	}
}

module.exports = {
	Game
};