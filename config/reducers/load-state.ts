import type {State} from '../state';

type LoadStateAction = {
	type: 'LOAD_STATE';
	payload: State;
};

const loadState = (_: State, action: LoadStateAction): State => action.payload;

export default loadState;

export type {
	LoadStateAction,
};
