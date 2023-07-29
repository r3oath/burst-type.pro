import {captureEvent, type State} from '../state';

type SetSFXSoundAction = {
	type: 'SET_SFX_SOUND';
	payload: boolean;
};

const setSFXSound = (state: State, action: SetSFXSoundAction): State => ({
	...state,
	...captureEvent(action.payload ? 'enableSFXSound' : 'disableSFXSound'),
	enableSFXSound: action.payload,
	lastSave: Date.now(),
});

export default setSFXSound;

export type {
	SetSFXSoundAction,
};
