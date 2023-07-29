import type {State} from '../state';

type SaveStateAction = {
	type: 'SAVE_STATE';
};

const saveState = (state: State): State => ({
	...state,
	lastSave: Date.now(),
});

export default saveState;

export type {
	SaveStateAction,
};
