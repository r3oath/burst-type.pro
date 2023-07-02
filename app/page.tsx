'use client';

import {useReducer, useRef, useCallback} from 'react';
import wordlist from '../config/wordlist.json';
import type {State} from '@app/config/state';
import {initialState, reducer} from '@app/config/state';
import {Finished, Instructions, LevelMap, Loader, Menu, WordVisualiser} from '@app/components';
import {useKeys, useSaveState} from '@app/hooks';

const Home = (): React.ReactElement => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const inputReference = useRef<HTMLInputElement>(null);

	const onLoadState = useCallback((state: State): void => {
		dispatch({type: 'LOAD_STATE', payload: state});
	}, []);

	const loadedState = useSaveState(state, onLoadState);

	const onAlpha = useCallback((key: string): void => {
		dispatch({type: 'APPEND_BUFFER', payload: key});
	}, []);

	const onBackspace = useCallback((): void => {
		dispatch({type: 'BACKSPACE_BUFFER'});
	}, []);

	const onNext = useCallback((): void => {
		dispatch({type: 'NEXT_LEVEL'});

		if (inputReference.current) {
			inputReference.current.focus();
		}
	}, []);

	const onJumpBackwards = useCallback((): void => {
		dispatch({type: 'JUMP_BACKWARDS'});
	}, []);

	const onJumpForwards = useCallback((): void => {
		dispatch({type: 'JUMP_FORWARDS'});
	}, []);

	const onJumpStart = useCallback((): void => {
		dispatch({type: 'JUMP_START'});
	}, []);

	const onJumpEnd = useCallback((): void => {
		dispatch({type: 'JUMP_END'});
	}, []);

	useKeys({onAlpha, onBackspace, onNext, onJumpBackwards, onJumpForwards, onJumpStart, onJumpEnd});

	const handleTargetWPMChange = useCallback((wpm: number) => (): void => {
		dispatch({type: 'SET_TARGET_WPM', payload: wpm});
	}, []);

	const handleTargetStreakChange = useCallback((streak: number) => (): void => {
		dispatch({type: 'SET_TARGET_STREAK', payload: streak});
	}, []);

	const handleReset = useCallback((): void => {
		if (!confirm('Are you sure you want to reset your progress?')) {
			return;
		}

		dispatch({type: 'RESET_STATE'});
	}, []);

	const handleSave = useCallback((): void => {
		dispatch({type: 'SAVE_STATE'});

		alert('Your progress and settings have been saved!');
	}, []);

	const handleToggleInstructions = useCallback((): void => {
		dispatch({type: 'TOGGLE_INSTRUCTIONS'});
	}, []);

	if (!loadedState) {
		return <Loader/>;
	}

	return (
		<main className="flex items-center justify-center w-full h-screen bg-neutral-900 text-neutral-600">
			{state.finished && <Finished/>}
			{!state.finished && <WordVisualiser word={state.word} targetStreak={state.targetStreak}/>}
			<input ref={inputReference} className="sr-only" type="text"/>
			<Menu
				state={state}
				onTargetWPMChange={handleTargetWPMChange}
				onTargetStreakChange={handleTargetStreakChange}
				onSave={handleSave}
				onReset={handleReset}
			/>
			<LevelMap state={state} wordlist={wordlist}/>
			{state.showInstructions && <Instructions onGetStarted={handleToggleInstructions}/>}
		</main>
	);
};

export default Home;
