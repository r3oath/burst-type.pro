import {useMemo} from 'react';
import type {Character, Word} from '@app/config/state';

type WordProperties = {
	word: Word;
	targetStreak: number;
};

const characterClasses = (character: Character): string => {
	if (character.correct === undefined) {
		return 'text-neutral-600';
	}

	if (character.correct) {
		return 'text-neutral-50';
	}

	return 'text-red-600';
};

const wpmIndicatorClasses = (word: Word): string => {
	if (word.wpm === undefined) {
		return 'text-neutral-600';
	}

	if (word.match && word.hitTargetWPM) {
		return 'text-green-600';
	}

	return 'text-red-600';
};

const wpmIndicatorAnimationClasses = (word: Word): string => {
	if (word.startTime !== undefined && word.wpm === undefined) {
		return 'italic animate-pulse';
	}

	return '';
};

const streakIndicatorClasses = (word: Word, index: number): string => {
	if (word.wpm !== undefined && (!word.match || !word.hitTargetWPM)) {
		return 'bg-red-600';
	}

	if (index < word.streak) {
		return 'bg-green-600';
	}

	return 'bg-neutral-700';
};

const WordVisualiser = ({word, targetStreak}: WordProperties): React.ReactElement => {
	const wpmIndicator = useMemo(() => {
		if (word.wpm !== undefined) {
			return `${word.wpm} WPM`;
		}

		if (word.startTime !== undefined) {
			return '>>> GO >>>';
		}

		return 'Ready';
	}, [word.wpm, word.startTime]);

	return (
		<div className="text-center">
			<p className="text-9xl font-bold tracking-wider">
				{word.characters.map((character, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<span key={index} className={characterClasses(character)}>
						{character.character}
					</span>
				))}
			</p>
			<p className={`text-3xl mt-6 ${wpmIndicatorClasses(word)} ${wpmIndicatorAnimationClasses(word)}`}>
				{wpmIndicator}
			</p>
			<div className="flex flex-wrap gap-1 justify-center mt-4 -skew-y-12 rotate-12">
				{Array.from({length: targetStreak}).map((_, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<div key={index} className={`w-4 h-4 ${streakIndicatorClasses(word, index)}`}/>
				))}
			</div>
		</div>
	);
};

export default WordVisualiser;
