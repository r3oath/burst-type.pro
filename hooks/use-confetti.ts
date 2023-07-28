'use client';

import {useEffect} from 'react';
import confetti from 'canvas-confetti';
import defaultColors from 'tailwindcss/colors';
import type {State} from '@app/config/state';

const colors = [
	defaultColors.green[500],
	defaultColors.neutral[50],
	defaultColors.neutral[900],
];

const random = (min: number, max: number): number => {
	return Math.random() * (max - min) + min;
};

const useConfetti = (state: State): void => {
	useEffect(() => {
		if (state.enableSFXConfetti === false) {
			return;
		}

		if (!['streakComplete', 'gameComplete', 'enableSFXConfetti'].includes(state.lastEvent ?? '')) {
			return;
		}

		const layers = [
			{particleCount: random(50, 100), scalar: 0.5, startVelocity: 50},
			{particleCount: random(25, 50), scalar: 1, startVelocity: 60},
			{particleCount: random(10, 20), scalar: 1.5, startVelocity: 70},
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
