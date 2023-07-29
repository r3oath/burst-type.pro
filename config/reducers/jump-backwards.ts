import {createWord, type State} from '../state';
import en1000 from '../../wordlists/en1000.json';

type JumpBackwardsAction = {
	type: 'JUMP_BACKWARDS';
};

const jumpBackwards = (state: State): State => {
	if (state.showInstructions) {
		return state;
	}

	if (state.highestLevel === undefined) {
		return state;
	}

	const previousLevel = Math.max(0, state.level - 1);

	return {
		...state,
		level: previousLevel,
		word: createWord(state.customWordlist ?? en1000, previousLevel),
		buffer: '',
		focused: true,
		finished: false,
		lastSave: Date.now(),
	};
};

export default jumpBackwards;

export type {
	JumpBackwardsAction,
};
