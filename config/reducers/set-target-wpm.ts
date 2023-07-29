import type {State} from '../state';

type SetTargetWPMAction = {
	type: 'SET_TARGET_WPM';
	payload: number;
};

const setTargetWPM = (state: State, action: SetTargetWPMAction): State => ({
	...state,
	targetWPM: action.payload,
	lastSave: Date.now(),
});

export default setTargetWPM;

export type {
	SetTargetWPMAction,
};
