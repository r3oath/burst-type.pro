import {createWord, type State} from '../state';
import en1000 from '../../wordlists/en1000.json';

type JumpForwardsAction = {
	type: 'JUMP_FORWARDS';
};

const jumpForwards = (state: State): State => {
	if (state.showInstructions) {
		return state;
	}

	if (state.highestLevel === undefined) {
		return state;
	}

	const nextLevel = Math.min(state.highestLevel, state.level + 1);

	return {
		...state,
		level: nextLevel,
		word: createWord(state.customWordlist ?? en1000, nextLevel),
		buffer: '',
		focused: true,
		finished: false,
		lastSave: Date.now(),
	};
};

export default jumpForwards;

export type {
	JumpForwardsAction,
};
