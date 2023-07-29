import {captureEvent, createWord, type State} from '../state';
import en1000 from '../../wordlists/en1000.json';

type SetBufferAction = {
	type: 'SET_BUFFER';
	payload: string;
};

const setBuffer = (state: State, action: SetBufferAction): State => {
	if (state.showInstructions) {
		return state;
	}

	if (state.finished) {
		return state;
	}

	if (state.word.streak >= state.targetStreak) {
		return state;
	}

	// eslint-disable-next-line unicorn/prefer-spread
	const match = action.payload.split('').every((character, index) => character === state.word.characters[index].character);
	const timeElapsed = (Date.now() - (state.word.startTime ?? 0)) / 60_000;
	const wpm = Math.round(action.payload.length / 5 / timeElapsed);
	const hitTargetWPM = wpm >= state.targetWPM;
	const capsDetected = action.payload !== action.payload.toLowerCase();

	if (!match) {
		return {
			...state,
			...captureEvent('failureTypo'),
			word: {
				...state.word,
				endTime: Date.now(),
				streak: 0,
				characters: state.word.characters.map((character, index) => ({
					...character,
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					correct: action.payload[index] === undefined
						? undefined
						: character.character === action.payload[index],
				})),
				wpm: 0,
				match: false,
				hitTargetWPM: false,
			},
			buffer: '',
			capsDetected,
		};
	}

	if (state.word.endTime === undefined && action.payload.length >= state.word.characters.length) {
		const streak = hitTargetWPM ? state.word.streak + 1 : 0;

		if (streak >= state.targetStreak) {
			// eslint-disable-next-line max-depth
			if (state.level + 1 === (state.customWordlist ?? en1000).length) {
				return {
					...state,
					...captureEvent('gameComplete'),
					finished: true,
					lastSave: Date.now(),
					capsDetected,
				};
			}

			return {
				...state,
				...captureEvent('streakComplete'),
				level: state.level + 1,
				highestLevel: Math.max(state.highestLevel ?? 0, state.level + 1),
				word: createWord(state.customWordlist ?? en1000, state.level + 1),
				buffer: '',
				lastSave: Date.now(),
				lastWPM: wpm,
				capsDetected,
			};
		}

		return {
			...state,
			...captureEvent(hitTargetWPM ? 'wordComplete' : 'failureSlow'),
			buffer: '',
			word: {
				...state.word,
				endTime: Date.now(),
				streak,
				characters: state.word.characters.map((character, index) => ({
					...character,
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					correct: action.payload[index] === undefined
						? undefined
						: character.character === action.payload[index],
				})),
				wpm,
				match,
				hitTargetWPM,
			},
			lastWPM: wpm,
			capsDetected,
		};
	}

	if (state.word.endTime === undefined) {
		return {
			...state,
			...captureEvent('type'),
			buffer: action.payload,
			word: {
				...state.word,
				startTime: state.word.startTime ?? Date.now(),
				characters: state.word.characters.map((character, index) => ({
					...character,
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					correct: action.payload[index] === undefined
						? undefined
						: character.character === action.payload[index],
				})),
			},
			capsDetected,
		};
	}

	const nextBuffer = action.payload;
	const repeatWord = createWord(state.customWordlist ?? en1000, state.level);

	if (state.word.streak < state.targetStreak) {
		return {
			...state,
			...captureEvent('type'),
			word: {
				...repeatWord,
				startTime: Date.now(),
				characters: repeatWord.characters.map((character, index) => ({
					...character,
					// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
					correct: nextBuffer[index] === undefined
						? undefined
						: character.character === nextBuffer[index],
				})),
				streak: state.word.streak,
			},
			buffer: nextBuffer,
			capsDetected,
		};
	}

	return state;
};

export default setBuffer;

export type {
	SetBufferAction,
};
