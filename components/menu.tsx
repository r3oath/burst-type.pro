import {Fragment, useMemo, useState} from 'react';
import type {State} from '@app/config/state';
import {streakOptions, wpmOptions} from '@app/config/state';
import type {Theme} from '@app/components/menu-button';
import MenuButton from '@app/components/menu-button';
import en1000 from '../wordlists/en1000.json';
import endbl from '../wordlists/endbl.json';
import rickroll from '../wordlists/rickroll.json';

type MenuProperties = {
	state: State;
	onTargetWPMChange: (wpm: number) => () => void;
	onTargetStreakChange: (streak: number) => () => void;
	onToggleDarkMode: () => void;
	onSetSFXConfetti: (enabled: boolean) => () => void;
	onSetSFXSound: (enabled: boolean) => () => void;
	onWordlistChange: (wordlist: string[]) => void;
	onReset: () => void;
	onSave: () => void;
};

type SubMenuProperties = {
	title: string;
	onClose: () => void;
	presetValues: number[];
	onTargetChange: (value: number) => () => void;
	currentValue: number;
	maxValue: number;
  label: string;
	theme: Theme;
};

type WordlistMenuProperties = {
	state: State;
	onWordlistChange: (wordlist: string[]) => void;
	onClose: () => void;
};

type SFXMenuProperties = {
	state: State;
	onSetSFXConfetti: (enabled: boolean) => () => void;
	onSetSFXSound: (enabled: boolean) => () => void;
	onClose: () => void;
};

type MenuState = 'closed' | 'sfx' | 'streak' | 'words' | 'wpm';

type WordlistPreset = {
	name: string;
	wordlist: string;
};

const wordlistPresets: WordlistPreset[] = [
	{name: 'F1K', wordlist: en1000.join(' ')},
	{name: 'DBL', wordlist: endbl.join(' ')},
	{name: 'Roll', wordlist: rickroll.join(' ')},
];

const SubMenu = ({
	title, onClose: handleOnClose, presetValues, onTargetChange: handleTargetChange, currentValue, maxValue, label, theme,
}: SubMenuProperties): React.ReactElement => {
	const handleManualTargetChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const value = Number.parseInt(event.target.value, 10);

		if (Number.isNaN(value)) {
			return;
		}

		handleTargetChange(Math.max(1, Math.min(maxValue, value)))();
	};

	return (
		<div className="fixed flex items-center justify-center inset-0 w-full h-full bg-neutral-100 dark:bg-neutral-900 bg-opacity-80 backdrop-blur-md z-50">
			<div className="mx-auto w-full max-w-sm">
				<h2 className="text-neutral-900 dark:text-neutral-100 uppercase text-4xl font-bold">{title}</h2>
				<div className="mt-6 flex flex-col">
					<p className="text-neutral-900 dark:text-neutral-100 uppercase text-xs">Presets</p>
					<div className="mt-4 flex flex-wrap items-center gap-4">
						{presetValues.map((value) => (
							<MenuButton
								key={value}
								label={label}
								value={value}
								theme={theme}
								enabled={value === currentValue}
								onClick={handleTargetChange(value)}
							/>
						))}
					</div>
				</div>
				<div className="mt-8 flex flex-col">
					<p className="text-neutral-900 dark:text-neutral-100 uppercase text-xs">{`Custom value (1-${maxValue})`}</p>
					<input
						className="mt-4 w-full px-4 py-4 text-neutral-900 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-400 dark:border-neutral-700 rounded-md"
						type="number"
						min={1}
						max={maxValue}
						value={currentValue}
						onChange={handleManualTargetChange}
					/>
				</div>
				<div className="mt-4 flex flex-col">
					<button className="w-full px-4 py-2 text-neutral-900 dark:text-neutral-200 bg-neutral-300 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border-2 border-neutral-400 dark:border-neutral-700 rounded-md" type="button" onClick={handleOnClose}>Close</button>
				</div>
			</div>
		</div>
	);
};

const WordlistMenu = ({state, onWordlistChange, onClose: handleOnClose}: WordlistMenuProperties): React.ReactElement => {
	const [wordlistValue, setWordlistValue] = useState((state.customWordlist ?? en1000).join(' '));
	const [isSaveEnabled, setIsSaveEnabled] = useState(false);

	const handleWordlistChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
		const isValidList = event.target.value.trim().split(/[ ,]+/).every((word) => word.length > 0 && /^[a-z]+$/.test(word));

		setWordlistValue(event.target.value);
		setIsSaveEnabled(isValidList);
	};

	const handleWordlistSave = (): void => {
		const wordlist = new Set(wordlistValue.trim().split(/[ ,]+/));
		// eslint-disable-next-line unicorn/prefer-spread
		onWordlistChange(Array.from(wordlist));
		handleOnClose();
	};

	const handleWordlistPresetChange = (wordlist: string) => (): void => {
		setWordlistValue(wordlist);
		setIsSaveEnabled(true);
	};

	return (
		<div className="fixed flex items-center justify-center inset-0 w-full h-full bg-neutral-100 dark:bg-neutral-900 bg-opacity-80 backdrop-blur-md z-50">
			<div className="mx-auto w-full max-w-xl">
				<h2 className="text-neutral-900 dark:text-neutral-100 uppercase text-4xl font-bold">Wordlist</h2>
				<div className="mt-6 flex flex-col">
					<p className="text-neutral-900 dark:text-neutral-100 uppercase text-xs">Presets</p>
					<div className="mt-4 flex flex-wrap items-center gap-4">
						{wordlistPresets.map(({name, wordlist}) => (
							<MenuButton
								key={name}
								label="Words"
								value={name}
								theme="green"
								enabled={wordlist === wordlistValue}
								onClick={handleWordlistPresetChange(wordlist)}
							/>
						))}
					</div>
				</div>
				<div className="mt-8 flex flex-col">
					<p className="text-neutral-900 dark:text-neutral-100 uppercase text-xs">Custom Wordlist (a-z, space or comma separated)</p>
					<textarea
						className="mt-4 w-full px-4 py-4 text-neutral-900 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-400 dark:border-neutral-700 rounded-md resize-none"
						value={wordlistValue}
						rows={10}
						onChange={handleWordlistChange}
					/>
				</div>
				<div className="mt-4 flex flex-col">
					{isSaveEnabled && (
						<span className="text-yellow-700 dark:text-yellow-500 font-bold text-center">Warning: changing wordlists will reset your progress.</span>
					)}
					<button
						className="mt-2 w-full px-4 py-2 text-neutral-900 dark:text-neutral-200 bg-neutral-300 dark:bg-neutral-800 enabled:hover:bg-neutral-200 dark:enabled:hover:bg-neutral-700 border-2 border-neutral-400 dark:border-neutral-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
						type="button"
						disabled={!isSaveEnabled}
						onClick={handleWordlistSave}
					>
						Save &amp; close
					</button>
					<button
						className="mt-2 w-full px-4 py-2 text-neutral-900 dark:text-neutral-200 underline underline-offset-4"
						type="button"
						onClick={handleOnClose}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

const SFXMenu = ({state, onSetSFXConfetti: handleSetSFXConfetti, onSetSFXSound: handleSetSFXSound, onClose: handleOnClose}: SFXMenuProperties): React.ReactElement => {
	return (
		<div className="fixed flex items-center justify-center inset-0 w-full h-full bg-neutral-100 dark:bg-neutral-900 bg-opacity-80 backdrop-blur-md z-50">
			<div className="mx-auto w-full max-w-xl">
				<h2 className="text-neutral-900 dark:text-neutral-100 uppercase text-4xl font-bold">Special Effects</h2>
				<div className="mt-6 flex flex-col">
					<p className="text-neutral-900 dark:text-neutral-100 uppercase text-xs">Confetti (streak completion & game over)</p>
					<div className="mt-4 flex flex-wrap items-center gap-4">
						<MenuButton
							label="Conf"
							value="ON"
							theme="green"
							enabled={state.enableSFXConfetti ?? true}
							onClick={handleSetSFXConfetti(true)}
						/>
						<MenuButton
							label="Conf"
							value="OFF"
							theme="green"
							enabled={!(state.enableSFXConfetti ?? true)}
							onClick={handleSetSFXConfetti(false)}
						/>
					</div>
				</div>
				<div className="mt-8 flex flex-col">
					<p className="text-neutral-900 dark:text-neutral-100 uppercase text-xs">Sounds (typing, errors, & streaks)</p>
					<div className="mt-4 flex flex-wrap items-center gap-4">
						<MenuButton
							label="Sound"
							value="ON"
							theme="green"
							enabled={state.enableSFXSound ?? true}
							onClick={handleSetSFXSound(true)}
						/>
						<MenuButton
							label="Sound"
							value="OFF"
							theme="green"
							enabled={!(state.enableSFXSound ?? true)}
							onClick={handleSetSFXSound(false)}
						/>
					</div>
				</div>
				<div className="mt-8 flex flex-col">
					<button className="w-full px-4 py-2 text-neutral-900 dark:text-neutral-200 bg-neutral-300 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border-2 border-neutral-400 dark:border-neutral-700 rounded-md" type="button" onClick={handleOnClose}>Close</button>
				</div>
			</div>
		</div>
	);
};

const Menu = ({
	state,
	onTargetWPMChange: handleTargetWPMChange,
	onTargetStreakChange: handleTargetStreakChange,
	onToggleDarkMode: handleToggleDarkMode,
	onSetSFXConfetti: handleSetSFXConfetti,
	onSetSFXSound: handleSetSFXSound,
	onWordlistChange: handleWordlistChange,
	onSave: handleSave,
	onReset: handleReset,
}: MenuProperties): React.ReactElement => {
	const [menuState, setMenuState] = useState<MenuState>('closed');

	const handleMenuStateChange = (menuState: MenuState) => (): void => {
		setMenuState(menuState);
	};

	const hasSFXEnabled = useMemo(
		() => [state.enableSFXConfetti, state.enableSFXSound].some(Boolean),
		[state.enableSFXConfetti, state.enableSFXSound],
	);

	const subMenus: Record<string, SubMenuProperties> = useMemo(() => ({
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
	}), [handleTargetStreakChange, handleTargetWPMChange, state.targetStreak, state.targetWPM]);

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
			{menuState === 'wpm' && <SubMenu {...subMenus.wpm}/>}
			{menuState === 'streak' && <SubMenu {...subMenus.streak}/>}
			{menuState === 'words' && <WordlistMenu state={state} onWordlistChange={handleWordlistChange} onClose={handleMenuStateChange('closed')}/>}
			{menuState === 'sfx' && <SFXMenu state={state} onSetSFXConfetti={handleSetSFXConfetti} onSetSFXSound={handleSetSFXSound} onClose={handleMenuStateChange('closed')}/>}
		</Fragment>
	);
};

export default Menu;
