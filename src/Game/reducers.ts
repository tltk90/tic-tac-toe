import { IGameState } from './Game';
import { KeyToBoardMapper } from '../helpers/KeyToBoardMapper';

export const gameReducer = (prev: IGameState, action): IGameState => {
	switch (action.type) {
		case 'move': {
			const key: string = action.payload;
			const board = [...prev.board];
			const boardLoc = KeyToBoardMapper(key);
			const error = typeof board[boardLoc] !== 'number' ? 'location occupied try another' : false;
			const label = prev.currentPlayer === 'player1' ? 'X' : 'O';
			let player = { ...prev[prev.currentPlayer] };
			if (!error) {
				player.last.push(key);
				board[boardLoc] = label;
			}
			const currentPlayer = prev.currentPlayer === 'player1' ? 'player2' : 'player1';
			return {
				...prev,
				board,
				currentPlayer: error ? prev.currentPlayer : currentPlayer,
				error: error ? error : '',
				[prev.currentPlayer]: { ...player }
			};
		}
		case 'undo': {
			const player1 = { ...prev.player1 };
			const player2 = { ...prev.player2 };
			const currentPlayer = prev.currentPlayer;
			const board = [...prev.board];
			let error = ''
			if (currentPlayer === 'player1' && player1.timeLeft > 0) {
				player1.timeLeft--;
			} else if (currentPlayer === 'player2' && player2.timeLeft > 0) {
				player2.timeLeft--;
			} else {
				error = 'you already undo more than 3 times'
			}
			if (!error.length) {
				const player1lastKey = player1.last.pop();
				const player2lastKey = player2.last.pop();
				if(player1lastKey === undefined && player2lastKey === undefined) {
					error = "unable to undo no full move was reached"
				}
				else {
					const player1boardLocation = KeyToBoardMapper(player1lastKey);
					const player2boardLocation = KeyToBoardMapper(player2lastKey);
					board[player1boardLocation] = parseInt(player1lastKey);
					board[player2boardLocation] = parseInt(player2lastKey);
				}
			}
			return { ...prev, player1, player2, board, error }
		}
		case 'wrongInput':
			return { ...prev, error: `wrong input only 1-9 digit or 'u' are acceptable` };
		case 'reset':
			const board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
			const player1 = prev.player1;
			const player2 = prev.player2;
			player1.last = [];
			player2.last = [];
			const currentPlayer = prev.round % 2 === 0 ? 'player2' : 'player1';
			return { ...prev, player1, player2, board, currentPlayer, error: '' };
		case 'end-round':
			const playerWin = action.payload;
			const round = prev.round + 1;
			switch (playerWin) {
				case 'Draw':
					return { ...prev, round, error: 'The round end with no winner' };
				case 'player1':
					const player1 = { ...prev.player1 };
					player1.win++;
					return { ...prev, round, error: 'Player1 win this game', player1  };
				case 'player2':
					const player2 = { ...prev.player2 };
					player2.win++;
					return { ...prev, round, error: 'Player2 win this game', player2 };
			}
			break;
		case 'end-game':
			return prev;
		default:
			return prev;
	}
};
