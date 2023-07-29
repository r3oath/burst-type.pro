import {createWord, type State} from '../state';
import en1000 from '../../wordlists/en1000.json';

type JumpStartAction = {
	type: 'JUMP_START';
};

const jumpStart = (state: State): State => {
	if (state.showInstructions) {
		return state;
	}

	return {
		...state,
		level: 0,
		word: createWord(state.customWordlist ?? en1000, 0),
		buffer: '',
		focused: true,
		finished: false,
		lastSave: Date.now(),
	};
};

export default jumpStart;

export type {
	JumpStartAction,
};
