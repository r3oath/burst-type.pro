import {useCallback, useState} from 'react';
import {useAppState} from '@app/config/state';
import en1000 from '../../wordlists/en1000.json';
import endbl from '../../wordlists/endbl.json';
import rickroll from '../../wordlists/rickroll.json';
import MenuButton from '../menu-button';

type WordlistMenuProperties = {
	onClose: () => void;
};

type WordlistPreset = {
	name: string;
	wordlist: string;
};

const wordlistPresets: WordlistPreset[] = [
	{name: 'F1K', wordlist: en1000.join(' ')},
	{name: 'DBL', wordlist: endbl.join(' ')},
	{name: 'Roll', wordlist: rickroll.join(' ')},
];

const WordlistMenu = ({onClose: handleOnClose}: WordlistMenuProperties): React.ReactElement => {
	const [state, dispatch] = useAppState();
	const [wordlistValue, setWordlistValue] = useState((state.customWordlist ?? en1000).join(' '));
	const [isSaveEnabled, setIsSaveEnabled] = useState(false);

	const handleWordlistChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>): void => {
		const isValidList = event.target.value.trim().split(/[ ,]+/).every((word) => word.length > 0);

		setWordlistValue(event.target.value);
		setIsSaveEnabled(isValidList);
	}, []);

	const handleWordlistSave = useCallback((): void => {
		const wordlist = new Set(wordlistValue.trim().split(/[ ,]+/));

		// eslint-disable-next-line unicorn/prefer-spread
		dispatch({type: 'SET_WORDLIST', payload: Array.from(wordlist)});
		handleOnClose();
	}, [dispatch, handleOnClose, wordlistValue]);

	const handleWordlistPresetChange = useCallback((wordlist: string) => (): void => {
		setWordlistValue(wordlist);
		setIsSaveEnabled(true);
	}, []);

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

export default WordlistMenu;
