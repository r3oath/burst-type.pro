import {type State} from '../state';

type ToggleDarkModeAction = {
	type: 'TOGGLE_DARK_MODE';
};

const toggleDarkMode = (state: State): State => ({
	...state,
	darkMode: !state.darkMode,
	lastSave: Date.now(),
});

export default toggleDarkMode;

export type {
	ToggleDarkModeAction,
};
