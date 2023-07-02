import type {State} from '@app/config/state';
import {streakOptions, wpmOptions} from '@app/config/state';
import MenuButton from '@app/components/menu-button';

type MenuProperties = {
	state: State;
	onTargetWPMChange: (wpm: number) => () => void;
	onTargetStreakChange: (streak: number) => () => void;
	onReset: () => void;
	onSave: () => void;
};

const Menu = ({
	state,
	onTargetWPMChange: handleTargetWPMChange,
	onTargetStreakChange: handleTargetStreakChange,
	onSave: handleSave,
	onReset: handleReset,
}: MenuProperties): React.ReactElement => {
	return (
		<div className="fixed flex justify-center top-0 right-0 w-full p-10">
			<div className="relative inline-flex flex-wrap justify-center items-center gap-4 mx-auto">
				{wpmOptions.map((wpm) => (
					<MenuButton
						key={wpm}
						label="WPM"
						value={wpm}
						theme="green"
						enabled={wpm === state.targetWPM}
						onClick={handleTargetWPMChange(wpm)}
					/>
				))}
				<div className="h-10 border-l-2 border-neutral-800 mx-4"/>
				{streakOptions.map((streak) => (
					<MenuButton
						key={streak}
						label="Streak"
						value={streak}
						theme="blue"
						enabled={streak === state.targetStreak}
						onClick={handleTargetStreakChange(streak)}
					/>
				))}
				<div className="h-10 border-l-2 border-neutral-800 mx-4"/>
				<MenuButton label="Save" value="S" theme="green" onClick={handleSave}/>
				<MenuButton label="Reset" value="R" theme="red" onClick={handleReset}/>
				<div className="absolute h-4 bottom-0 -mb-8 w-full border-l-2 border-b-2 border-r-2 border-neutral-800 rounded-b-md text-center">
					<span className="absolute bottom-0 left-[50%] -translate-x-[50%] bg-neutral-900 -mb-3 px-3 font-bold uppercase text-sm">options</span>
				</div>
				{window.location.hostname !== 'www.burst-type.pro' && (
					<div className="absolute h-4 bottom-0 -mb-24 w-full text-center">
						<span className="text-sm text-yellow-400 px-4 py-2 border border-yellow-400 rounded-md">
							<span>You are on an experimental build, view the latest stable version at</span>
							{' '}
							<a className="underline" href="https://www.burst-type.pro">burst-type.pro</a>
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default Menu;
