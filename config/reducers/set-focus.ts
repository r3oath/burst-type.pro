import type {State} from '../state';

type SetFocusAction = {
	type: 'SET_FOCUS';
	payload: boolean;
};

const setFocus = (state: State, action: SetFocusAction): State => ({
	...state,
	focused: action.payload,
});

export default setFocus;

export type {
	SetFocusAction,
};
