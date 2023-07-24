import en1000 from '../wordlists/en1000.json';

type Event =
	| 'disableSFXConfetti'
	| 'enableSFXConfetti'
	| 'failureSlow'
	| 'failureTypo'
	| 'gameComplete'
	| 'loadState'
	| 'streakComplete'
	| 'type'
	| 'wordComplete';

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
	darkMode: boolean;
	customWordlist?: string[];
	lastEvent?: Event;
	lastEventTime?: number;
	enableSFXConfetti?: boolean;
};

const captureEvent = (event: Event): Pick<State, 'lastEvent' | 'lastEventTime'> => ({
	lastEvent: event,
	lastEventTime: Date.now(),
});

const createWord = (list: string[], index: number): Word => ({
	// eslint-disable-next-line unicorn/prefer-spread
	characters: `${list[index]} `.toLowerCase().split('').map(character => ({character})),
	match: false,
	hitTargetWPM: false,
	streak: 0,
});

const defaultLevel = 0;
const defaultTargetWPM = 90;
const defaultTargetStreak = 5;

const wpmOptions = [30, 60, 90, 120, 200];
const streakOptions = [1, 3, 5, 10, 25];

const initialState: State = {
	word: createWord(en1000, defaultLevel),
	level: defaultLevel,
	highestLevel: defaultLevel,
	buffer: '',
	targetWPM: defaultTargetWPM,
	targetStreak: defaultTargetStreak,
	finished: false,
	showInstructions: true,
	darkMode: true,
	enableSFXConfetti: true,
};

type Action = {
	type: 'APPEND_BUFFER';
	payload: string;
} | {
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
	type: 'SET_SFX_CONFETTI';
	payload: boolean;
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
	type: 'SET_WORDLIST';
	payload: string[];
} | {
	type: 'TOGGLE_DARK_MODE';
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
		case 'SET_WORDLIST': {
			return {
				...initialState,
				level: 0,
				highestLevel: 0,
				word: createWord(action.payload, 0),
				targetWPM: state.targetWPM,
				targetStreak: state.targetStreak,
				darkMode: state.darkMode,
				customWordlist: action.payload,
				lastSave: Date.now(),
				showInstructions: false,
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
			const timeElapsed = (Date.now() - (state.word.startTime ?? 0)) / 60_000;
			const wpm = Math.round(appendBuffer.length / 5 / timeElapsed);
			const hitTargetWPM = wpm >= state.targetWPM;

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
							correct: appendBuffer[index] === undefined
								? undefined
								: character.character === appendBuffer[index],
						})),
						wpm: 0,
						match: false,
						hitTargetWPM: false,
					},
					buffer: '',
				};
			}

			if (state.word.endTime === undefined && appendBuffer.length >= state.word.characters.length) {
				const streak = hitTargetWPM ? state.word.streak + 1 : 0;

				if (streak >= state.targetStreak) {
					// eslint-disable-next-line max-depth
					if (state.level + 1 === (state.customWordlist ?? en1000).length) {
						return {
							...state,
							...captureEvent('gameComplete'),
							finished: true,
							lastSave: Date.now(),
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

			if (state.word.endTime === undefined) {
				return {
					...state,
					...captureEvent('type'),
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
				word: createWord(state.customWordlist ?? en1000, nextLevel),
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
				word: createWord(state.customWordlist ?? en1000, previousLevel),
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
				word: createWord(state.customWordlist ?? en1000, 0),
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
				word: createWord(state.customWordlist ?? en1000, state.highestLevel),
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
		case 'TOGGLE_DARK_MODE': {
			return {
				...state,
				darkMode: !state.darkMode,
				lastSave: Date.now(),
			};
		}
		case 'SET_SFX_CONFETTI': {
			return {
				...state,
				...captureEvent(action.payload ? 'enableSFXConfetti' : 'disableSFXConfetti'),
				enableSFXConfetti: action.payload,
				lastSave: Date.now(),
			};
		}
		default: {
			return state;
		}
	}
};

export {
	captureEvent,
	createWord,
	defaultLevel,
	defaultTargetStreak,
	defaultTargetWPM,
	initialState,
	reducer,
	streakOptions,
	wpmOptions,
};

export type {
	Action,
	Character,
	Optional,
	State,
	Word,
};
