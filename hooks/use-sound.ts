'use client';

import type {State} from '@app/config/state';
import {useCallback, useEffect, useState} from 'react';

const useSound = (state: State): void => {
	const [loadedSounds, setLoadedSounds] = useState<{[url: string]: AudioBuffer}>({});
	const [lastTimestamp, setLastTimestamp] = useState<number>();
	const [audioContext, setAudioContext] = useState<AudioContext>();

	useEffect(() => {
		const context = new AudioContext();
		setAudioContext(context);
	}, []);

	const loadSound = async (url: string): Promise<AudioBuffer> => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (loadedSounds[url] !== undefined) {
			return loadedSounds[url];
		}

		if (audioContext === undefined) {
			throw new Error('Audio context is undefined');
		}

		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();

		const sound = await audioContext.decodeAudioData(arrayBuffer);

		setLoadedSounds({
			...loadedSounds,
			[url]: sound,
		});
		
		return sound;
	};

	const playSound = useCallback(
		// eslint-disable-next-line unicorn/no-object-as-default-parameter
		async (url: string, options = {detune: 0}): Promise<void> => {
			if (audioContext === undefined) {
				return;
			}
			
			const sound = await loadSound(url);

			const source = audioContext.createBufferSource();
			source.buffer = sound;

			source.detune.value = options.detune;

			source.connect(audioContext.destination);
			source.start(0);
		}, [audioContext, loadedSounds],
	);

	useEffect(() => {
		if (state.enableSFXSound === false || lastTimestamp === state.lastEventTime || state.lastEvent === undefined) {
			return;
		}

		let sound = '';
		let detune = 0;

		const sounds = state.sounds;

		switch (state.lastEvent) {
			case 'type': {
				sound = sounds.type[Math.floor(Math.random() * sounds.type.length)];
				break;
			}
			case 'wordComplete': {
				sound = sounds.wordComplete[Math.floor(Math.random() * sounds.gameComplete.length)];
				detune = 100 + 100 * (state.word.streak / state.targetStreak); 
				break;
			}
			case 'streakComplete': {
				sound = sounds.streakComplete[Math.floor(Math.random() * sounds.streakComplete.length)];
				break;
			}
			case 'failureSlow': {
				sound = sounds.failureSlow[Math.floor(Math.random() * sounds.failureSlow.length)];
				break;
			}
			case 'failureTypo': {
				sound = sounds.failureTypo[Math.floor(Math.random() * sounds.failureTypo.length)];
				break;
			}
			default: {
				break;
			}
		}
		
		if (sound === '') {
			return;
		}
		
		setLastTimestamp(state.lastEventTime);

		playSound(sound, {detune});		
	}, [state, playSound]);
};

export default useSound;