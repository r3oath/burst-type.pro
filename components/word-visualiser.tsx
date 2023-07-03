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

const wpmIndicatorClasses = (state: State): string => {
	if (state.word.wpm === undefined) {
		return 'text-neutral-600';
	}

	if (state.word.match && state.word.hitTargetWPM) {
		return 'text-green-600';
	}

	return 'text-red-600';
};

const wpmIndicatorAnimationClasses = (state: State): string => {
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

	return 'bg-neutral-700';
};

const WordVisualiser = ({state, targetStreak}: WordProperties): React.ReactElement => {
	const wpmIndicator = useMemo(() => {
		if (state.word.wpm !== undefined) {
			return `${state.word.wpm} WPM`;
		}

		if (state.word.startTime !== undefined) {
			return 'Recording';
		}

		return 'Ready';
	}, [state.word.wpm, state.word.startTime]);

	return (
		<div className="text-center">
			<p className="relative text-9xl font-bold tracking-wider">
				{state.word.streak < state.targetStreak && (state.word.startTime === undefined || state.word.wpm !== undefined) && (
					<div className="absolute top-[50%] -translate-y-[30%] -translate-x-[130%] left-0 animate-pulse text-neutral-100">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
							<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
						</svg>
					</div>
				)}
				{state.word.characters.filter(w => w.character !== ' ').map((character, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<span key={index} className={characterClasses(state, character)}>
						{character.character}
					</span>
				))}
			</p>
			<p className={`text-3xl mt-6 tracking-tighter ${wpmIndicatorClasses(state)} ${wpmIndicatorAnimationClasses(state)}`}>
				{wpmIndicator}
			</p>
			<div className="flex flex-wrap gap-1 justify-center mt-4 -skew-y-12 rotate-12">
				{Array.from({length: targetStreak}).map((_, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<div key={index} className={`w-4 h-4 ${streakIndicatorClasses(state, index)}`}/>
				))}
			</div>
		</div>
	);
};

export default WordVisualiser;
