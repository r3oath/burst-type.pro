import {captureEvent, type State} from '../state';

type HandleCancelAction = {
	type: 'HANDLE_CANCEL';
	payload: KeyboardEvent;
};

const handleCancel = (state: State, action: HandleCancelAction): State => {
	if (!state.focused) {
		return state;
	}

	action.payload.preventDefault();
	action.payload.stopPropagation();

	return {
		...state,
		...captureEvent('failureTypo'),
		word: {
			...state.word,
			endTime: Date.now(),
			streak: 0,
			characters: state.word.characters.map((character) => ({
				...character,
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				correct: false,
			})),
			wpm: 0,
			match: false,
			hitTargetWPM: false,
		},
		buffer: '',
	};
};

export default handleCancel;

export type {
	HandleCancelAction,
};
