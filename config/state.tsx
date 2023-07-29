'use client';

import {createContext, useContext, useReducer} from 'react';
import en1000 from '../wordlists/en1000.json';

type Event =
	| 'disableSFXConfetti'
	| 'disableSFXSound'
	| 'enableSFXConfetti'
	| 'enableSFXSound'
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
	focused: boolean;
	word: Word;
	level: number;
	highestLevel?: number;
	buffer: string;
	targetWPM: number;
	targetStreak: number;
	finished: boolean;
	lastSave?: number;
	showInstructions: boolean;
	showCredits: boolean;
	lastWPM?: number;
	darkMode: boolean;
	customWordlist?: string[];
	lastEvent?: Event;
	lastEventTime?: number;
	enableSFXConfetti?: boolean;
	enableSFXSound?: boolean;
	sounds: {
		type: string[];
		wordComplete: string[];
		gameComplete: string[];
		streakComplete: string[];
		failureSlow: string[];
		failureTypo: string[];
	};
};

type Action = {
	type: 'HANDLE_CANCEL';
	payload: KeyboardEvent;
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
	type: 'SET_BUFFER';
	payload: string;
} | {
	type: 'SET_CHARACTERS';
	payload: Character[];
} | {
	type: 'SET_FOCUS';
	payload: boolean;
} | {
	type: 'SET_SFX_CONFETTI';
	payload: boolean;
} | {
	type: 'SET_SFX_SOUND';
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
	type: 'TOGGLE_CREDITS';
} | {
	type: 'TOGGLE_DARK_MODE';
} | {
	type: 'TOGGLE_INSTRUCTIONS';
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
	focused: true,
	word: createWord(en1000, defaultLevel),
	level: defaultLevel,
	highestLevel: defaultLevel,
	buffer: '',
	targetWPM: defaultTargetWPM,
	targetStreak: defaultTargetStreak,
	finished: false,
	showInstructions: true,
	showCredits: false,
	darkMode: true,
	enableSFXConfetti: true,
	enableSFXSound: true,
	sounds: {
		type: ['/sounds/type.wav'],
		wordComplete: ['/sounds/word-complete.wav'],
		gameComplete: ['/sounds/game-complete.wav'],
		streakComplete: ['/sounds/streak-complete.wav'],
		failureSlow: ['/sounds/failure-slow.wav'],
		failureTypo: ['/sounds/failure-typo.wav'],
	},
};

const AppContext = createContext<[State, React.Dispatch<Action>]>([initialState, () => {}]);

const useAppState = (): [State, React.Dispatch<Action>] => useContext(AppContext);

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
		case 'SET_FOCUS': {
			return {
				...state,
				focused: action.payload,
			};
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
		case 'SET_BUFFER': {
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
		case 'HANDLE_CANCEL': {
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
				focused: true,
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
				focused: true,
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
				focused: true,
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
				focused: true,
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
		case 'TOGGLE_CREDITS': {
			return {
				...state,
				showCredits: !state.showCredits,
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
		case 'SET_SFX_SOUND': {
			return {
				...state,
				...captureEvent(action.payload ? 'enableSFXSound' : 'disableSFXSound'),
				enableSFXSound: action.payload,
				lastSave: Date.now(),
			};
		}
		default: {
			return state;
		}
	}
};

const AppState = ({children}: {children: React.ReactNode}): JSX.Element => {
	const contextValue = useReducer(reducer, initialState);

	return (
		<AppContext.Provider value={contextValue}>
			{children}
		</AppContext.Provider>
	);
};

export {
	AppState,
	captureEvent,
	createWord,
	defaultLevel,
	defaultTargetStreak,
	defaultTargetWPM,
	initialState,
	reducer,
	streakOptions,
	useAppState,
	wpmOptions,
};

export type {
	Action,
	Character,
	Optional,
	State,
	Word,
};
