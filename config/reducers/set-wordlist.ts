import {createWord, initialState, type State} from '../state';

type SetWordlistAction = {
	type: 'SET_WORDLIST';
	payload: string[];
};

const setWordlist = (state: State, action: SetWordlistAction): State => ({
	...initialState,
	level: 0,
	highestLevel: 0,
	word: createWord(action.payload, 0),
	targetWPM: state.targetWPM,
	targetStreak: state.targetStreak,
	darkMode: state.darkMode,
	customWordlist: action.payload,
	lastSave: Date.now(),
	showInstructions: false,
});

export default setWordlist;

export type {
	SetWordlistAction,
};
