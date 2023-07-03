import {useMemo} from 'react';
import type {Character, State} from '@app/config/state';

type WordProperties = {
	state: State;
	targetStreak: number;
};

const characterClasses = (state: State, character: Character): string => {
	if (state.word.streak === state.targetStreak) {
		return 'text-green-500';
	}

	if (state.word.endTime !== undefined || character.correct === undefined) {
		return 'text-neutral-600';
	}

	if (character.correct) {
		return 'text-neutral-50';
	}

	return 'text-red-600';
};

const statusIndicatorClasses = (state: State): string => {
	if (state.word.wpm === undefined) {
		return 'text-neutral-600';
	}

	if (state.word.match && state.word.hitTargetWPM) {
		return 'text-green-600';
	}

	return 'text-red-600';
};

const statusIndicatorAnimationClasses = (state: State): string => {
	if (state.word.startTime !== undefined && state.word.wpm === undefined) {
		return 'italic animate-pulse';
	}

	return '';
};

const streakIndicatorClasses = (state: State, index: number): string => {
	if (state.word.wpm !== undefined && (!state.word.match || !state.word.hitTargetWPM)) {
		return 'bg-red-600';
	}

	if (index < state.word.streak) {
		return 'bg-green-600';
	}

	if (index === state.word.streak) {
		return 'bg-neutral-400 animate-pulse';
	}

	return 'bg-neutral-700';
};

const WordVisualiser = ({state, targetStreak}: WordProperties): React.ReactElement => {
	const statusIndicator = useMemo(() => {
		if (state.word.endTime !== undefined && state.word.hitTargetWPM) {
			return 'Success';
		}

		if (state.word.endTime !== undefined && !state.word.hitTargetWPM) {
			return 'Failed';
		}

		if (state.word.startTime !== undefined) {
			return 'Recording';
		}

		return 'Ready';
	}, [state.word.endTime, state.word.hitTargetWPM, state.word.startTime]);

	const lastWPMIndicator = useMemo(() => {
		if (state.lastWPM === undefined) {
			return '';
		}

		return ` — Last WPM: ${state.lastWPM}`;
	}, [state.lastWPM]);

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
				{Array.from({length: targetStreak}).map((_, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<div key={index} className={`w-4 h-4 ${streakIndicatorClasses(state, index)}`}/>
				))}
			</div>
			<p className={`text-xl mt-3 tracking-tighter ${statusIndicatorClasses(state)} ${statusIndicatorAnimationClasses(state)}`}>
				{statusIndicator}
				{lastWPMIndicator}
			</p>
		</div>
	);
};

export default WordVisualiser;
