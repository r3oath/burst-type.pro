import {useCallback, useMemo} from 'react';
import {useAppState, type Character, type State} from '@app/config/state';

const characterClasses = (state: State, character: Character): string => {
	if (state.word.streak === state.targetStreak) {
		return 'text-green-600 dark:text-green-500';
	}

	if (state.word.wpm !== undefined && state.word.hitTargetWPM) {
		return 'text-green-600 dark:text-green-500';
	}

	if (state.word.wpm !== undefined && !state.word.match) {
		return 'text-red-600 dark:text-red-700';
	}

	if (state.word.wpm !== undefined && !state.word.hitTargetWPM) {
		return 'text-sky-700 dark:text-sky-800';
	}

	if (character.correct === undefined) {
		return 'text-neutral-400 dark:text-neutral-600';
	}

	return 'text-neutral-950 dark:text-neutral-50';
};

const statusIndicatorAnimationClasses = (state: State): string => {
	if (state.word.startTime !== undefined && state.word.wpm === undefined) {
		return 'italic animate-pulse';
	}

	return '';
};

const streakIndicatorClasses = (state: State, index: number): string => {
	if (index < state.word.streak) {
		return 'bg-green-600 dark:bg-green-600';
	}

	if (index === state.word.streak) {
		return 'bg-neutral-400 dark:bg-neutral-400';
	}

	return 'bg-neutral-300 dark:bg-neutral-700';
};

const WordVisualiser = (): React.ReactElement | undefined => {
	const [state, dispatch] = useAppState();

	const handleSetFocus = useCallback((): void => {
		dispatch({type: 'SET_FOCUS', payload: true});
	}, [dispatch]);

	const statusIndicator = useMemo(() => {
		if (state.word.endTime !== undefined && state.word.hitTargetWPM) {
			return 'Success';
		}

		if (state.word.endTime !== undefined && !state.word.match) {
			let output = 'Typo';

			if (state.typoText !== undefined && state.typoText !== ' ') {
				output += `: ${state.typoText}`;
			}

			return output;
		}

		if (state.word.endTime !== undefined && !state.word.hitTargetWPM) {
			return 'Slow';
		}

		if (state.word.startTime !== undefined) {
			return 'Recording';
		}

		return 'Ready';
	}, [state.word.endTime, state.word.hitTargetWPM, state.word.match, state.word.startTime, state.typoText]);

	const lastWPMIndicator = useMemo(() => {
		if (state.lastWPM === undefined) {
			return 'Last WPM score: Unknown';
		}

		return `Last WPM score: ${state.lastWPM}`;
	}, [state.lastWPM]);

	if (state.finished) {
		return undefined;
	}

	return (
		<div className="relative text-center w-2/3 p-10">
			<p className="relative text-9xl font-bold tracking-wider">
				{state.word.characters.filter(w => w.character !== ' ').map((character, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<span key={index} className={characterClasses(state, character)}>
						{character.character}
					</span>
				))}
			</p>
			<div className="flex flex-wrap gap-1 justify-center mt-6 -skew-y-12 rotate-12">
				{Array.from({length: state.targetStreak}).map((_, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<div key={index} className={`w-4 h-4 ${streakIndicatorClasses(state, index)}`}/>
				))}
			</div>
			<p className={`text-xl mt-6 text-neutral-600 dark:text-neutral-400 font-semibold ${statusIndicatorAnimationClasses(state)}`}>
				{statusIndicator}
			</p>
			<p className="text-base mt-1 tracking-tighter text-neutral-600 dark:text-neutral-400">
				{lastWPMIndicator}
			</p>
			{state.focused && state.capsDetected && (
				<p className="absolute flex items-center justify-center gap-3 bottom-0 -mb-2 inset-x-0 w-full text-base text-center tracking-tighter text-red-700 dark:text-red-500">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
						<path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd"/>
					</svg>
					<span>Caps detected (type to dismiss)</span>
				</p>
			)}
			{!state.focused && (
				<div className="absolute inset-0 flex items-center justify-center bg-neutral-50/50 dark:bg-neutral-900/50 backdrop-blur-lg transition-colors">
					<button className="flex items-center gap-3 font-medium text-lg text-neutral-900 dark:text-neutral-200 hover:bg-neutral-900/10 hover:dark:bg-neutral-100/10 px-4 py-2 rounded-full" type="button" onClick={handleSetFocus}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
							<path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.68zM3 10.5a.75.75 0 01.75-.75H6a.75.75 0 010 1.5H3.75A.75.75 0 013 10.5zm14.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H18a.75.75 0 01-.75-.75zm-8.962 3.712a.75.75 0 010 1.061l-1.591 1.591a.75.75 0 11-1.061-1.06l1.591-1.592a.75.75 0 011.06 0z" clipRule="evenodd"/>
						</svg>
						<span>Click here to focus &amp; continue</span>
					</button>
				</div>
			)}
		</div>
	);
};

export default WordVisualiser;
