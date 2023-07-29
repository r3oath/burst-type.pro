import {Fragment, useCallback, useMemo, useState} from 'react';
import {streakOptions, useAppState, wpmOptions} from '@app/config/state';
import MenuButton from '@app/components/menu-button';
import SFXMenu from './sfx-menu';
import WordlistMenu from './wordlist-menu';
import type {TargetMenuProperties} from './target-menu';
import TargetMenu from './target-menu';

type MenuState = 'closed' | 'sfx' | 'streak' | 'words' | 'wpm';

const Menu = (): React.ReactElement => {
	const [state, dispatch] = useAppState();
	const [menuState, setMenuState] = useState<MenuState>('closed');

	const handleTargetWPMChange = useCallback((wpm: number) => (): void => {
		dispatch({type: 'SET_TARGET_WPM', payload: wpm});
	}, [dispatch]);

	const handleTargetStreakChange = useCallback((streak: number) => (): void => {
		dispatch({type: 'SET_TARGET_STREAK', payload: streak});
	}, [dispatch]);

	const handleReset = useCallback((): void => {
		if (!confirm('Are you sure you want to reset your progress?')) {
			return;
		}

		dispatch({type: 'RESET_STATE'});
	}, [dispatch]);

	const handleSave = useCallback((): void => {
		dispatch({type: 'SAVE_STATE'});

		alert('Your progress and settings have been saved!');
	}, [dispatch]);

	const handleToggleDarkMode = useCallback((): void => {
		dispatch({type: 'TOGGLE_DARK_MODE'});
	}, [dispatch]);

	const handleMenuStateChange = useCallback((menuState: MenuState) => (): void => {
		setMenuState(menuState);
	}, []);

	const hasSFXEnabled = useMemo(
		() => [state.enableSFXConfetti, state.enableSFXSound].some(Boolean),
		[state.enableSFXConfetti, state.enableSFXSound],
	);

	const targetMenus: Record<string, TargetMenuProperties> = useMemo(() => ({
		wpm: {
			title: 'WPM',
			onClose: handleMenuStateChange('closed'),
			presetValues: wpmOptions,
			onTargetChange: handleTargetWPMChange,
			currentValue: state.targetWPM,
			label: 'WPM',
			maxValue: 9999,
			theme: 'green',
		},
		streak: {
			title: 'Streak',
			onClose: handleMenuStateChange('closed'),
			presetValues: streakOptions,
			onTargetChange: handleTargetStreakChange,
			currentValue: state.targetStreak,
			label: 'Streak',
			maxValue: 25,
			theme: 'green',
		},
	}), [handleMenuStateChange, handleTargetStreakChange, handleTargetWPMChange, state.targetStreak, state.targetWPM]);

	return (
		<Fragment>
			<div className="fixed flex justify-center top-0 right-0 w-full p-10">
				<div className="relative inline-flex flex-wrap justify-center items-center gap-4 mx-auto">
					<MenuButton label="WPM" value={state.targetWPM} theme="green" onClick={handleMenuStateChange('wpm')}/>
					<MenuButton label="Streak" value={state.targetStreak} theme="green" onClick={handleMenuStateChange('streak')}/>
					<MenuButton label="Words" value="W" theme="green" onClick={handleMenuStateChange('words')}/>
					<div className="h-10 border-l-2 border-neutral-300 dark:border-neutral-800 mx-4"/>
					<MenuButton label="SFX" value={hasSFXEnabled ? 'ON' : 'OFF'} theme="green" enabled={hasSFXEnabled} onClick={handleMenuStateChange('sfx')}/>
					<div className="h-10 border-l-2 border-neutral-300 dark:border-neutral-800 mx-4"/>
					<MenuButton label="Theme" value={state.darkMode ? 'D' : 'L'} theme="green" onClick={handleToggleDarkMode}/>
					<MenuButton label="Save" value="S" theme="green" onClick={handleSave}/>
					<MenuButton label="Reset" value="R" theme="red" onClick={handleReset}/>
					<div className="absolute h-4 bottom-0 -mb-8 w-full border-l-2 border-b-2 border-r-2 border-neutral-300 dark:border-neutral-800 rounded-b-md text-center">
						<span className="absolute bottom-0 left-[50%] -translate-x-[50%] bg-neutral-50 dark:bg-neutral-900 -mb-3 px-3 font-bold uppercase text-sm text-neutral-400 dark:text-neutral-600 transition-colors">options</span>
					</div>
				</div>
				{!['www.burst-type.pro', 'localhost'].includes(window.location.hostname) && (
					<div className="absolute h-4 bottom-0 -mb-16 w-full text-center">
						<span className="text-sm text-neutral-950 dark:text-yellow-400 bg-yellow-200 dark:bg-transparent px-4 py-2 border border-yellow-400 dark:border-yellow-400 rounded-md">
							<span>You are on an experimental build, view the latest stable version at</span>
							{' '}
							<a className="underline" href="https://www.burst-type.pro">burst-type.pro</a>
						</span>
					</div>
				)}
			</div>
			{menuState === 'wpm' && <TargetMenu {...targetMenus.wpm}/>}
			{menuState === 'streak' && <TargetMenu {...targetMenus.streak}/>}
			{menuState === 'words' && <WordlistMenu onClose={handleMenuStateChange('closed')}/>}
			{menuState === 'sfx' && <SFXMenu onClose={handleMenuStateChange('closed')}/>}
		</Fragment>
	);
};

export default Menu;
