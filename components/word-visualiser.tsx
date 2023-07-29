import {useMemo} from 'react';
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
	const [state] = useAppState();

	const statusIndicator = useMemo(() => {
		if (state.word.endTime !== undefined && state.word.hitTargetWPM) {
			return 'Success';
		}

		if (state.word.endTime !== undefined && !state.word.match) {
			return 'Typo';
		}

		if (state.word.endTime !== undefined && !state.word.hitTargetWPM) {
			return 'Slow';
		}

		if (state.word.startTime !== undefined) {
			return 'Recording';
		}

		return 'Ready';
	}, [state.word.endTime, state.word.hitTargetWPM, state.word.match, state.word.startTime]);

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
		<div className="text-center w-2/3">
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
		</div>
	);
};

export default WordVisualiser;
