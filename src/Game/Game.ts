import { createStore, IStore } from '../store/Store';
import { gameReducer } from './reducers';
import { printToConsole } from '../helpers/printToConsole';
export declare type BoardLabel = 'X' | 'O' | number;
export interface IGameState {
	board: BoardLabel[];
	round: number;
	player1: {
		win: number;
		last: string[];
		timeLeft: number;
	};
	player2: {
		win: number;
		last: string[];
		timeLeft: number;
	}
	currentPlayer: 'player1' | 'player2';
	error: string
}

const initialState: IGameState = {
	board: [1,2,3,4,5,6,7,8,9],
	round: 1,
	player1: {
		win: 0,
		last: [],
		timeLeft: 3
	},
	player2: {
		win: 0,
		last: [],
		timeLeft: 3
	},
	currentPlayer: 'player1',
	error: ''
};

export class Game {
	store: IStore;
	round: number;
	roundEnd: boolean;
	readline = require('readline').createInterface({
		input: process.stdin,
		output: process.stdout
	});
	waitForUser = () => {
		this.readline.question('', (ans) => {
			const isOkMove = parseInt(ans) && parseInt(ans) >= 1 && parseInt(ans) <= 9;
			const isUndo = ans.toLowerCase() === 'u';
			if(isOkMove) {
				this.store.dispatch({ type: 'move', payload: ans })
			}
			else if(isUndo){
				this.store.dispatch({ type: 'undo'})
			}
			else{
				this.store.dispatch({ type: 'wrongInput'})
			}

		});
	};
	init() {
		this.store = createStore(gameReducer, initialState);
		this.round = this.store.getState().round;
		this.roundEnd = false;
		this.flow();
	}

	start() {
		this.init();
		this.store.subscribe(this.endRound.bind(this));
		this.store.subscribe(this.endGame.bind(this));
		this.store.subscribe( this.flow.bind(this));



	}

	flow(){
		printToConsole.state(this.store.getState());
		this.checkForWinRound();
		this.waitForUser();
	}

	checkForWinRound() {
		const labelToPlayersMap = {'X': 'player1', 'O': 'player2'};
		let playerWin: string | false = false;
		let leadLabel;
		const { board } = this.store.getState();
		if(typeof board[0] !== 'number'){
			leadLabel = board[0];
			if(leadLabel === board[3] && leadLabel === board[6]) {
				playerWin = labelToPlayersMap[leadLabel];
			}
			else if(leadLabel === board[1] && leadLabel === board[2]){
				playerWin = labelToPlayersMap[leadLabel];
			}
		}
		if(!playerWin && typeof board[4] !== 'number'){
			leadLabel = board[4];
			if(leadLabel === board[3] && leadLabel === board[5]) {
				playerWin = labelToPlayersMap[leadLabel];
			}
			else if(leadLabel === board[1] && leadLabel === board[7]){
				playerWin = labelToPlayersMap[leadLabel];
			}
			else if(leadLabel === board[0] && leadLabel === board[8]){
				playerWin = labelToPlayersMap[leadLabel];
			}
			else if(leadLabel === board[2] && leadLabel === board[6]){
				playerWin = labelToPlayersMap[leadLabel];
			}
		}
		if(!playerWin && typeof board[8] !== 'number') {
			leadLabel = board[8];
			if(leadLabel === board[5] && leadLabel === board[2]) {
				playerWin = labelToPlayersMap[leadLabel];
			}
			else if(leadLabel === board[6] && leadLabel === board[7]){
				playerWin = labelToPlayersMap[leadLabel];
			}
		}
		if(board.every( cell => typeof cell !== 'number') && !playerWin) {
			playerWin = 'Draw';
		}
		if(playerWin && !this.roundEnd) {
			this.roundEnd = true;
			this.store.dispatch({ type: 'end-round', payload: playerWin });
		}
	}

	endRound() {
		if(this.store.getState().round !== this.round) {
			this.round = this.store.getState().round;
			this.readline.question('press any key to start the next round', this.reset.bind(this));
		}
	}

	endGame() {
		const {player1, player2, round } = this.store.getState();
		let end = false;
		if(player1.win === 3) {
			end = true;
			printToConsole.end('Player1 Win the game');
		}
		else if(player2.win === 3) {
			end = true;
			printToConsole.end('Player2 Win the game');
		}
		else if(round === 8) {
			end = true;
			printToConsole.end('No one Win the game');
		}
		if(end) {
			process.exit();
		}

	}
	reset() {
		this.store.dispatch({type: 'reset'});
		this.roundEnd = false;
	}
}
