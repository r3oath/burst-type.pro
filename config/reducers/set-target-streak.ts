import type {State} from '../state';

type SetTargetStreakAction = {
	type: 'SET_TARGET_STREAK';
	payload: number;
};

const setTargetStreak = (state: State, action: SetTargetStreakAction): State => ({
	...state,
	targetStreak: action.payload,
	lastSave: Date.now(),
});

export default setTargetStreak;

export type {
	SetTargetStreakAction,
};
