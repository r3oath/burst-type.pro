'use client';

import {useReducer, useCallback} from 'react';
import en1000 from '../wordlists/en1000.json';
import type {State} from '@app/config/state';
import {initialState, reducer} from '@app/config/state';
import {Finished, Footer, Instructions, LevelMap, Loader, Menu, WordVisualiser} from '@app/components';
import {useKeys, useSaveState} from '@app/hooks';

const Home = (): React.ReactElement => {
	const [state, dispatch] = useReducer(reducer, initialState);

	const onLoadState = useCallback((state: State): void => {
		dispatch({type: 'LOAD_STATE', payload: state});
	}, []);

	const loadedState = useSaveState(state, onLoadState);

	const onAlpha = useCallback((key: string): void => {
		dispatch({type: 'APPEND_BUFFER', payload: key});
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

	useKeys({onType: onAlpha, onJumpBackwards, onJumpForwards, onJumpStart, onJumpEnd});

	const handleTargetWPMChange = useCallback((wpm: number) => (): void => {
		dispatch({type: 'SET_TARGET_WPM', payload: wpm});
	}, []);

	const handleTargetStreakChange = useCallback((streak: number) => (): void => {
		dispatch({type: 'SET_TARGET_STREAK', payload: streak});
	}, []);

	const handleWordlistChange = useCallback((wordlist: string[]): void => {
		dispatch({type: 'SET_WORDLIST', payload: wordlist});
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

	const handleToggleDarkMode = useCallback((): void => {
		dispatch({type: 'TOGGLE_DARK_MODE'});
	}, []);

	if (!loadedState) {
		return <Loader/>;
	}

	return (
		<main className={state.darkMode ? 'dark' : ''}>
			<div className="flex items-center justify-center w-full h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors">
				{state.finished && <Finished/>}
				{!state.finished && <WordVisualiser state={state} targetStreak={state.targetStreak}/>}
				<Menu
					state={state}
					onTargetWPMChange={handleTargetWPMChange}
					onTargetStreakChange={handleTargetStreakChange}
					onToggleDarkMode={handleToggleDarkMode}
					onWordlistChange={handleWordlistChange}
					onSave={handleSave}
					onReset={handleReset}
				/>
				<LevelMap state={state} wordlist={state.customWordlist ?? en1000}/>
				<Footer/>
				{state.showInstructions && <Instructions onGetStarted={handleToggleInstructions}/>}
			</div>
		</main>
	);
};

export default Home;
