import {type State} from '../state';

type ToggleCreditsAction = {
	type: 'TOGGLE_CREDITS';
};

const toggleCredits = (state: State): State => ({
	...state,
	showCredits: !state.showCredits,
});

export default toggleCredits;

export type {
	ToggleCreditsAction,
};
