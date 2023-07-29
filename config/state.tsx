'use client';

import {createContext, useContext, useReducer} from 'react';
import * as RF from './reducers';
import type * as RT from './reducers';
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
	capsDetected: boolean;
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

type Action =
	| RT.HandleCancelAction
	| RT.JumpBackwardsAction
	| RT.JumpEndAction
	| RT.JumpForwardsAction
	| RT.JumpStartAction
	| RT.LoadStateAction
	| RT.ResetStateAction
	| RT.SaveStateAction
	| RT.SetBufferAction
	| RT.SetFocusAction
	| RT.SetSFXConfettiAction
	| RT.SetSFXSoundAction
	| RT.SetTargetStreakAction
	| RT.SetTargetWPMAction
	| RT.SetWordlistAction
	| RT.ToggleCreditsAction
	| RT.ToggleDarkModeAction
	| RT.ToggleInstructionsAction;

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
	capsDetected: false,
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
		case 'SAVE_STATE': { return RF.saveState(state); }
		case 'LOAD_STATE': { return RF.loadState(state, action); }
		case 'SET_FOCUS': { return RF.setFocus(state, action); }
		case 'SET_TARGET_STREAK': { return RF.setTargetStreak(state, action); }
		case 'SET_TARGET_WPM': { return RF.setTargetWPM(state, action); }
		case 'SET_WORDLIST': { return RF.setWordlist(state, action); }
		case 'SET_BUFFER': { return RF.setBuffer(state, action); }
		case 'HANDLE_CANCEL': { return RF.handleCancel(state, action); }
		case 'JUMP_FORWARDS': { return RF.jumpForwards(state); }
		case 'JUMP_BACKWARDS': { return RF.jumpBackwards(state); }
		case 'JUMP_START': { return RF.jumpStart(state); }
		case 'JUMP_END': { return RF.jumpEnd(state); }
		case 'RESET_STATE': { return RF.resetState(); }
		case 'TOGGLE_INSTRUCTIONS': { return RF.toggleInstructions(state); }
		case 'TOGGLE_DARK_MODE': { return RF.toggleDarkMode(state); }
		case 'TOGGLE_CREDITS': { return RF.toggleCredits(state); }
		case 'SET_SFX_CONFETTI': { return RF.setSFXConfetti(state, action); }
		case 'SET_SFX_SOUND': { return RF.setSFXSound(state, action); }
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
	initialState,
	reducer,
	streakOptions,
	useAppState,
	wpmOptions,
};

export type {
	Action,
	Character,
	State,
	Word,
};
