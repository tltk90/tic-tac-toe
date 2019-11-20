import { IGameState } from '../Game/Game';

export interface IStore {
	state: IGameState;
	listeners: Array<() => any>;
	getState: () => IGameState;
	subscribe: (listener) => void;
	dispatch: (action) => void;
}

export interface IAction {
	type: string;
	payload: any;
}

export const createStore = (reducer: (prevState: IGameState, action: IAction) => IGameState, initialState: IGameState) => {
	const store: IStore = {
		state: initialState,
		listeners: [],
		subscribe: undefined,
		getState: undefined,
		dispatch: undefined
	};
	
	store.subscribe = (listener) => store.listeners.push(listener);
	store.getState = () => store.state;
	store.dispatch = (action: IAction) => {
		store.state = reducer(store.state, action);
		store.listeners.forEach( l => l())
	};
	return store;
};

