import {captureEvent, type State} from '../state';

type SetSFXConfettiAction = {
	type: 'SET_SFX_CONFETTI';
	payload: boolean;
};

const setSFXConfetti = (state: State, action: SetSFXConfettiAction): State => ({
	...state,
	...captureEvent(action.payload ? 'enableSFXConfetti' : 'disableSFXConfetti'),
	enableSFXConfetti: action.payload,
	lastSave: Date.now(),
});

export default setSFXConfetti;

export type {
	SetSFXConfettiAction,
};
