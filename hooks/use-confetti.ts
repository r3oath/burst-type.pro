'use client';

import {useEffect} from 'react';
import confetti from 'canvas-confetti';
import resolveConfig from 'tailwindcss/resolveConfig';
import type {State} from '@app/config/state';
import tailwindConfig from '../tailwind.config.js';

const fullConfig = resolveConfig(tailwindConfig);

const colors = [
	fullConfig.theme.colors.green[500],
	fullConfig.theme.colors.neutral[50],
	fullConfig.theme.colors.neutral[900],
];

const random = (min: number, max: number): number => {
	return Math.random() * (max - min) + min;
};

const useConfetti = (state: State): void => {
	useEffect(() => {
		if (state.lastEvent !== 'streakComplete' && state.lastEvent !== 'gameComplete') {
			return;
		}

		confetti({
			particleCount: random(50, 100),
			angle: 60,
			spread: 60,
			origin: {x: 0, y: 1},
			scalar: 0.5,
			colors: colors,
			startVelocity: 50,
			disableForReducedMotion: true,
		});

		confetti({
			particleCount: random(25, 50),
			angle: 60,
			spread: 60,
			origin: {x: 0, y: 1},
			scalar: 1,
			colors: colors,
			startVelocity: 60,
			disableForReducedMotion: true,
		});

		confetti({
			particleCount: random(10, 20),
			angle: 60,
			spread: 60,
			origin: {x: 0, y: 1},
			scalar: 1.5,
			colors: colors,
			startVelocity: 70,
			disableForReducedMotion: true,
		});

		confetti({
			particleCount: random(50, 100),
			angle: 120,
			spread: 60,
			origin: {x: 1, y: 1},
			scalar: 0.5,
			colors: colors,
			startVelocity: 50,
			disableForReducedMotion: true,
		});

		confetti({
			particleCount: random(25, 50),
			angle: 120,
			spread: 60,
			origin: {x: 1, y: 1},
			scalar: 1,
			colors: colors,
			startVelocity: 60,
			disableForReducedMotion: true,
		});

		confetti({
			particleCount: random(10, 20),
			angle: 120,
			spread: 60,
			origin: {x: 1, y: 1},
			scalar: 1.5,
			colors: colors,
			startVelocity: 70,
			disableForReducedMotion: true,
		});
	}, [state.lastEvent, state.lastEventTime]);
};

export default useConfetti;
