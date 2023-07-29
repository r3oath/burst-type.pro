import {createWord, type State} from '../state';
import en1000 from '../../wordlists/en1000.json';

type JumpEndAction = {
	type: 'JUMP_END';
};

const jumpEnd = (state: State): State => {
	if (state.showInstructions) {
		return state;
	}

	if (state.highestLevel === undefined) {
		return state;
	}

	return {
		...state,
		level: state.highestLevel,
		word: createWord(state.customWordlist ?? en1000, state.highestLevel),
		buffer: '',
		focused: true,
		finished: false,
		lastSave: Date.now(),
	};
};

export default jumpEnd;

export type {
	JumpEndAction,
};
