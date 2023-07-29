'use client';

import {useEffect} from 'react';
import confetti from 'canvas-confetti';
import defaultColors from 'tailwindcss/colors';
import {useAppState} from '@app/config/state';
import {randomNumber} from '@app/lib/random';

const colors = [
	defaultColors.green[500],
	defaultColors.neutral[50],
	defaultColors.neutral[900],
];

const useConfetti = (): void => {
	const [state] = useAppState();

	useEffect(() => {
		if (state.enableSFXConfetti === false) {
			return;
		}

		if (!['streakComplete', 'gameComplete', 'enableSFXConfetti'].includes(state.lastEvent ?? '')) {
			return;
		}

		const layers = [
			{particleCount: randomNumber(50, 100), scalar: 0.5, startVelocity: 50},
			{particleCount: randomNumber(25, 50), scalar: 1, startVelocity: 60},
			{particleCount: randomNumber(10, 20), scalar: 1.5, startVelocity: 70},
		];

		const canons = [
			{angle: 60, spread: 60, origin: {x: 0, y: 1}},
			{angle: 120, spread: 60, origin: {x: 1, y: 1}},
		];

		for (const layer of layers) {
			for (const canon of canons) {
				confetti({
					...layer,
					...canon,
					colors,
					disableForReducedMotion: true,
				});
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.lastEventTime]);
};

export default useConfetti;
