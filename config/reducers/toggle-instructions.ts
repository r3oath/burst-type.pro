import {type State} from '../state';

type ToggleInstructionsAction = {
	type: 'TOGGLE_INSTRUCTIONS';
};

const toggleInstructions = (state: State): State => ({
	...state,
	showInstructions: !state.showInstructions,
});

export default toggleInstructions;

export type {
	ToggleInstructionsAction,
};
