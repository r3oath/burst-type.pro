import type {Theme} from '../menu-button';
import MenuButton from '../menu-button';

type TargetMenuProperties = {
	title: string;
	onClose: () => void;
	presetValues: number[];
	onTargetChange: (value: number) => () => void;
	currentValue: number;
	maxValue: number;
  label: string;
	theme: Theme;
};

const TargetMenu = ({
	title, onClose: handleOnClose, presetValues, onTargetChange: handleTargetChange, currentValue, maxValue, label, theme,
}: TargetMenuProperties): React.ReactElement => {
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

export default TargetMenu;

export type {
	TargetMenuProperties,
};
