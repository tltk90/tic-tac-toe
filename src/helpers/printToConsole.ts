import { IGameState } from '../Game/Game';


export const printToConsole = {
	title: () => {
		console.log("\n*********** Tic-Tac-Toe ***********")
	},
	state: (state: IGameState) => {
		printToConsole.title();
		console.log(`game: #${state.round} player1 win: ${state.player1.win} player2 win: ${state.player2.win}`);
		console.log(`        undo left: ${state.player1.timeLeft}      undo left: ${state.player2.timeLeft}`);
		console.log(`| ${state.board[6]} | ${state.board[7]} | ${state.board[8]} |`);
		console.log(`| ${state.board[3]} | ${state.board[4]} | ${state.board[5]} |`);
		console.log(`| ${state.board[0]} | ${state.board[1]} | ${state.board[2]} |`);
		console.log(state.error.length? state.error : `wait for ${state.currentPlayer} move enter number of cell of 'u' to undo last move`);
	},
	end: (message) => {
		printToConsole.title();
		console.log(`${message}`)
	}
};
