// puzzle size: 500x500
import {generateTileArray, isSolvable, getInversions} from './utils.js';
import {createTiles, updateTiles, animateTile} from './domUtils.js';

const puzzle = document.getElementById('puzzle');

const statEls = {
	game: document.getElementById('game'),
	turn: document.getElementById('turn'),
	avg: document.getElementById('avg')
};

const gridWidth = 4;
document.documentElement.style.setProperty('--grid', gridWidth);

let currentTurn = 0;
let currentGame = 0;

let totalTurns = 0;

class Game {
	constructor(displayEl) {
		this.turn = 1;
		this.game = 1;
		this.totalTurns = 0;
		let storage = JSON.parse(window.localStorage.getItem('tileStats'));
		if (storage) {
			this.game = storage.game;
			this.totalTurns = storage.totalTurns;
		}
		this.element = displayEl;
		this.refreshDisplay();
	}

	finished() {
		this.totalTurns += this.turn;
		this.turn = 1;
		this.game += 1;
		this.refreshDisplay();
	}

	nextTurn() {
		this.turn += 1;
		this.refreshDisplay();
	}

	get averageTurns() {
		if (this.game < 2) return null;
		return this.totalTurns / (this.game - 1);
	}

	refreshDisplay() {
		const {game, turn, avg} = statEls;
		game.innerText = this.game;
		turn.innerText = this.turn;
		avg.innerText = this.averageTurns || 'N/A';
		window.localStorage.setItem('tileStats', JSON.stringify({game: this.game, totalTurns: this.totalTurns}));
	}
}


class Board {
	constructor(gameObj, gridWidth = 3) {
		this.tiles = generateTileArray(gridWidth);
		this.gridWidth = gridWidth;
		this.gameObj = gameObj;
		this.createTiles();
	}

	get isSolvable() {
		return isSolvable(this.tiles, 3);
	}
	get inversions() {
		return getInversions(this.tiles);
	}

	createTiles() {
		createTiles(puzzle, this.tiles, this);
	}
	updateTiles() {
		updateTiles(puzzle, this.tiles);
	}

	setCustomTiles(arr) {
		if (isSolvable(arr, this.gridWidth)) {
			this.tiles = arr;
			this.updateTiles();
		}
	}

	get finished() {
		let sorted = [...this.tiles].sort();

		for (let i = 0; i < this.tiles.length; i++) {
			if (this.tiles[i] !== sorted[i]) {
				return false;
			}
		}
		return true;
	}

	swap(n) {
		n -= 0;
		const emptyTilePos = this.tiles.findIndex(t => t === null);
		const swapTilePos = this.tiles.findIndex(t => t === n);

		const emptyX = emptyTilePos % this.gridWidth;
		const emptyY = Math.floor(emptyTilePos / this.gridWidth);

		const swapX = swapTilePos % this.gridWidth;
		const swapY = Math.floor(swapTilePos / this.gridWidth);

		const hor = (emptyY === swapY) && (Math.abs(emptyX - swapX) === 1);
		const ver = (emptyX === swapX) && (Math.abs(emptyY - swapY) === 1);

		if (!(hor || ver)) {
			console.log("Element can't be swapped");
			return;
		}

		this.gameObj.nextTurn();

		const dir = [emptyX - swapX, emptyY - swapY];
		animateTile(puzzle, n, [...dir]);

		this.tiles[emptyTilePos] = n;
		this.tiles[swapTilePos] = null;
		this.updateTiles();
		
		if (this.finished) {
			setTimeout(() => {
				alert("Finished!");
				this.gameObj.finished();
				return new Board(this.gridWidth);
			}, 100);
		} else {
			return;
		}
	}
}

const game = new Game(document.getElementById('game'));
const board = new Board(game, gridWidth);

// board.setCustomTiles([1,2,3,4,5,6,null,7,8]);




