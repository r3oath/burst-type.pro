import wordlist from '../config/wordlist.json';

type Optional<T> = {
	[P in keyof T]?: T[P];
};

type Character = {
	character: string;
	correct?: boolean;
};

type Word = {
	characters: Character[];
	startTime?: number;
	endTime?: number;
	wpm?: number;
	hitTargetWPM: boolean;
	match: boolean;
	streak: number;
};

type State = {
	word: Word;
	level: number;
	highestLevel?: number;
	buffer: string;
	targetWPM: number;
	targetStreak: number;
	finished: boolean;
	lastSave?: number;
	showInstructions: boolean;
	lastWPM?: number;
};

const createWord = (raw: string): Word => ({
	// eslint-disable-next-line unicorn/prefer-spread
	characters: `${raw} `.toLowerCase().split('').map(character => ({character})),
	match: false,
	hitTargetWPM: false,
	streak: 0,
});

const defaultLevel = 0;
const defaultTargetWPM = 90;
const defaultTargetStreak = 5;

const wpmOptions = [30, 60, 90, 120, 200, 500, 1000];
const streakOptions = [1, 3, 5, 10, 25];

const initialState: State = {
	word: createWord(wordlist[defaultLevel]),
	level: defaultLevel,
	highestLevel: defaultLevel,
	buffer: '',
	targetWPM: defaultTargetWPM,
	targetStreak: defaultTargetStreak,
	finished: false,
	showInstructions: true,
};

type Action = {
	type: 'APPEND_BUFFER';
	payload: string;
} |{
	type: 'JUMP_BACKWARDS';
} | {
	type: 'JUMP_END';
} | {
	type: 'JUMP_FORWARDS';
} | {
	type: 'JUMP_START';
} | {
	type: 'LOAD_STATE';
	payload: State;
} | {
	type: 'RESET_STATE';
} | {
	type: 'SAVE_STATE';
} | {
	type: 'SET_CHARACTERS';
	payload: Character[];
} | {
	type: 'SET_TARGET_STREAK';
	payload: number;
} | {
	type: 'SET_TARGET_WPM';
	payload: number;
} | {
	type: 'SET_WORD';
	payload: Word;
} | {
	type: 'TOGGLE_INSTRUCTIONS';
};

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'SAVE_STATE': {
			return {
				...state,
				lastSave: Date.now(),
			};
		}
		case 'LOAD_STATE': {
			return action.payload;
		}
		case 'SET_TARGET_STREAK': {
			return {
				...state,
				targetStreak: action.payload,
				lastSave: Date.now(),
			};
		}
		case 'SET_TARGET_WPM': {
			return {
				...state,
				targetWPM: action.payload,
				lastSave: Date.now(),
			};
		}
		case 'SET_WORD': {
			return {
				...state,
				word: action.payload,
			};
		}
		case 'SET_CHARACTERS': {
			return {
				...state,
				word: {
					...state.word,
					characters: action.payload,
				},
			};
		}
		case 'APPEND_BUFFER': {
			if (state.showInstructions) {
				return state;
			}

			if (state.finished) {
				return state;
			}

			if (state.buffer.length === 0 && action.payload === ' ') {
				return state;
			}

			if (state.word.streak >= state.targetStreak) {
				return state;
			}

			const appendBuffer = state.buffer + action.payload;
			// eslint-disable-next-line unicorn/prefer-spread
			const match = appendBuffer.split('').every((character, index) => character === state.word.characters[index].character);
			const wpm = Math.round(60 / ((Date.now() - (state.word.startTime ?? 0)) / 1000));
			const hitTargetWPM = wpm >= state.targetWPM;

			if (!match) {
				return {
					...state,
					word: createWord(wordlist[state.level]),
					buffer: '',
				};
			}

			if (state.word.endTime === undefined && appendBuffer.length >= state.word.characters.length) {
				const streak = hitTargetWPM ? state.word.streak + 1 : 0;

				if (streak >= state.targetStreak) {
					// eslint-disable-next-line max-depth
					if (state.level + 1 === wordlist.length) {
						return {
							...state,
							finished: true,
							lastSave: Date.now(),
						};
					}

					return {
						...state,
						level: state.level + 1,
						highestLevel: Math.max(state.highestLevel ?? 0, state.level + 1),
						word: createWord(wordlist[state.level + 1]),
						buffer: '',
						lastSave: Date.now(),
					};
				}

				return {
					...state,
					buffer: '',
					word: {
						...state.word,
						endTime: Date.now(),
						streak,
						characters: state.word.characters.map((character, index) => ({
							...character,
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
							correct: appendBuffer[index] === undefined
								? undefined
								: character.character === appendBuffer[index],
						})),
						wpm,
						match,
						hitTargetWPM,
					},
					lastWPM: wpm,
				};
			}

			if (state.word.endTime === undefined && appendBuffer.length < state.word.characters.length) {
				return {
					...state,
					buffer: appendBuffer,
					word: {
						...state.word,
						startTime: state.word.startTime ?? Date.now(),
						characters: state.word.characters.map((character, index) => ({
							...character,
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
							correct: appendBuffer[index] === undefined
								? undefined
								: character.character === appendBuffer[index],
						})),
					},
				};
			}

			if (state.word.wpm === undefined) {
				return state;
			}

			const nextBuffer = action.payload;
			const repeatWord = createWord(wordlist[state.level]);

			if (!state.word.match || state.word.wpm < state.targetWPM) {
				return {
					...state,
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
					},
					buffer: nextBuffer,
				};
			}

			if (state.word.streak < state.targetStreak) {
				return {
					...state,
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
				};
			}

			return state;
		}
		case 'JUMP_FORWARDS': {
			if (state.showInstructions) {
				return state;
			}

			if (state.highestLevel === undefined) {
				return state;
			}

			const nextLevel = Math.min(state.highestLevel, state.level + 1);

			return {
				...state,
				level: nextLevel,
				word: createWord(wordlist[nextLevel]),
				buffer: '',
				finished: false,
				lastSave: Date.now(),
			};
		}
		case 'JUMP_BACKWARDS': {
			if (state.showInstructions) {
				return state;
			}

			if (state.highestLevel === undefined) {
				return state;
			}

			const previousLevel = Math.max(0, state.level - 1);

			return {
				...state,
				level: previousLevel,
				word: createWord(wordlist[previousLevel]),
				buffer: '',
				finished: false,
				lastSave: Date.now(),
			};
		}
		case 'JUMP_START': {
			if (state.showInstructions) {
				return state;
			}

			return {
				...state,
				level: 0,
				word: createWord(wordlist[0]),
				buffer: '',
				finished: false,
				lastSave: Date.now(),
			};
		}
		case 'JUMP_END': {
			if (state.showInstructions) {
				return state;
			}

			if (state.highestLevel === undefined) {
				return state;
			}

			return {
				...state,
				level: state.highestLevel,
				word: createWord(wordlist[state.highestLevel]),
				buffer: '',
				finished: false,
				lastSave: Date.now(),
			};
		}
		case 'RESET_STATE': {
			return {
				...initialState,
				lastSave: Date.now(),
			};
		}
		case 'TOGGLE_INSTRUCTIONS': {
			return {
				...state,
				showInstructions: !state.showInstructions,
			};
		}
		default: {
			return state;
		}
	}
};

export {
	initialState,
	reducer,
	createWord,
	defaultLevel,
	defaultTargetStreak,
	defaultTargetWPM,
	wpmOptions,
	streakOptions,
};

export type {
	Optional,
	State,
	Word,
	Character,
	Action,
};
