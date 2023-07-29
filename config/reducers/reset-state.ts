import {initialState, type State} from '../state';

type ResetStateAction = {
	type: 'RESET_STATE';
};

const resetState = (): State => ({
	...initialState,
	lastSave: Date.now(),
});

export default resetState;

export type {
	ResetStateAction,
};
