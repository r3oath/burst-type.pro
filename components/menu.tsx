import {Fragment, useMemo, useState} from 'react';
import type {State} from '@app/config/state';
import {streakOptions, wpmOptions} from '@app/config/state';
import type {Theme} from '@app/components/menu-button';
import MenuButton from '@app/components/menu-button';

type MenuProperties = {
	state: State;
	onTargetWPMChange: (wpm: number) => () => void;
	onTargetStreakChange: (streak: number) => () => void;
	onReset: () => void;
	onSave: () => void;
};

type SubMenuProperties = {
	onClose: () => void;
	presetValues: number[];
	onTargetChange: (value: number) => () => void;
	currentValue: number;
	maxValue: number;
  label: string;
	theme: Theme;
};

type MenuState = 'closed' | 'streak' | 'wpm';

const SubMenu = ({
	onClose: handleOnClose, presetValues, onTargetChange: handleTargetChange, currentValue, maxValue, label, theme,
}: SubMenuProperties): React.ReactElement => {
	const handleManualTargetChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const value = Number.parseInt(event.target.value, 10);

		if (Number.isNaN(value)) {
			return;
		}

		handleTargetChange(Math.max(1, Math.min(maxValue, value)))();
	};

	return (
		<div className="fixed flex items-center justify-center inset-0 w-full h-full bg-neutral-900 bg-opacity-90 backdrop-blur-md z-50">
			<div className="mx-auto w-full max-w-sm">
				<div className="flex flex-col">
					<p className="text-neutral-100 uppercase text-xs">Quick Presets</p>
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
				<div className="mt-12 flex flex-col">
					<p className="text-neutral-100 uppercase text-xs">{`Custom value (1-${maxValue})`}</p>
					<input
						className="mt-4 w-full px-4 py-4 text-neutral-200 bg-neutral-900 border-2 border-neutral-700 rounded-md"
						type="number"
						min={1}
						max={maxValue}
						value={currentValue}
						onChange={handleManualTargetChange}
					/>
				</div>
				<div className="mt-4 flex flex-col">
					<button className="w-full px-4 py-2 text-neutral-200 bg-neutral-800 hover:bg-neutral-700 border-2 border-neutral-700 rounded-md" type="button" onClick={handleOnClose}>Close</button>
				</div>
			</div>
		</div>
	);
};

const Menu = ({
	state,
	onTargetWPMChange: handleTargetWPMChange,
	onTargetStreakChange: handleTargetStreakChange,
	onSave: handleSave,
	onReset: handleReset,
}: MenuProperties): React.ReactElement => {
	const [menuState, setMenuState] = useState<MenuState>('closed');

	const handleMenuStateChange = (menuState: MenuState) => (): void => {
		setMenuState(menuState);
	};

	const subMenus: Record<Exclude<MenuState, 'closed'>, SubMenuProperties> = useMemo(() => ({
		wpm: {
			onClose: handleMenuStateChange('closed'),
			presetValues: wpmOptions,
			onTargetChange: handleTargetWPMChange,
			currentValue: state.targetWPM,
			label: 'WPM',
			maxValue: 9999,
			theme: 'green',
		},
		streak: {
			onClose: handleMenuStateChange('closed'),
			presetValues: streakOptions,
			onTargetChange: handleTargetStreakChange,
			currentValue: state.targetStreak,
			label: 'Streak',
			maxValue: 25,
			theme: 'blue',
		},
	}), [handleTargetStreakChange, handleTargetWPMChange, state.targetStreak, state.targetWPM]);

	return (
		<Fragment>
			<div className="fixed flex justify-center top-0 right-0 w-full p-10">
				<div className="relative inline-flex flex-wrap justify-center items-center gap-4 mx-auto">
					<MenuButton label="WPM" value={state.targetWPM} theme="green" onClick={handleMenuStateChange('wpm')}/>
					<MenuButton label="Streak" value={state.targetStreak} theme="blue" onClick={handleMenuStateChange('streak')}/>
					<div className="h-10 border-l-2 border-neutral-800 mx-4"/>
					<MenuButton label="Save" value="S" theme="green" onClick={handleSave}/>
					<MenuButton label="Reset" value="R" theme="red" onClick={handleReset}/>
					<div className="absolute h-4 bottom-0 -mb-8 w-full border-l-2 border-b-2 border-r-2 border-neutral-800 rounded-b-md text-center">
						<span className="absolute bottom-0 left-[50%] -translate-x-[50%] bg-neutral-900 -mb-3 px-3 font-bold uppercase text-sm">options</span>
					</div>
				</div>
				{!['www.burst-type.pro', 'localhost'].includes(window.location.hostname) && (
					<div className="absolute h-4 bottom-0 -mb-16 w-full text-center">
						<span className="text-sm text-yellow-400 px-4 py-2 border border-yellow-400 rounded-md">
							<span>You are on an experimental build, view the latest stable version at</span>
							{' '}
							<a className="underline" href="https://www.burst-type.pro">burst-type.pro</a>
						</span>
					</div>
				)}
			</div>
			{menuState !== 'closed' && <SubMenu {...subMenus[menuState]}/>}
		</Fragment>
	);
};

export default Menu;
