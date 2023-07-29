'use client';

import {useCallback, useEffect, useState} from 'react';
import {useAppState} from '@app/config/state';

type AudioCache = Record<string, AudioBuffer>;

const randomElement = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];

const useSound = (): void => {
	const [state] = useAppState();
	const [loadedSounds, setLoadedSounds] = useState<AudioCache>({});
	const [audioContext, setAudioContext] = useState<AudioContext>();

	useEffect(() => {
		const context = new AudioContext();

		setAudioContext(context);
	}, []);

	const loadSound = useCallback(async (url: string): Promise<AudioBuffer> => {
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

		setLoadedSounds({...loadedSounds, [url]: sound});

		return sound;
	}, [audioContext, loadedSounds]);

	const playSound = useCallback(async (url: string, detune = 0): Promise<void> => {
		if (audioContext === undefined) {
			return;
		}

		const sound = await loadSound(url);
		const source = audioContext.createBufferSource();

		source.buffer = sound;
		source.detune.value = detune;
		source.connect(audioContext.destination);
		source.start(0);
	}, [audioContext, loadSound]);

	useEffect(() => {
		if (state.enableSFXSound === false) {
			return;
		}

		switch (state.lastEvent) {
			case 'type': {
				playSound(randomElement(state.sounds.type));
				break;
			}
			case 'wordComplete': {
				playSound(randomElement(state.sounds.wordComplete), 100 + 100 * (state.word.streak / state.targetStreak));
				break;
			}
			case 'streakComplete': {
				playSound(randomElement(state.sounds.streakComplete));
				break;
			}
			case 'gameComplete': {
				playSound(randomElement(state.sounds.gameComplete));
				break;
			}
			case 'failureSlow': {
				playSound(randomElement(state.sounds.failureSlow));
				break;
			}
			case 'failureTypo': {
				playSound(randomElement(state.sounds.failureTypo));
				break;
			}
			default: {
				break;
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.lastEventTime]);
};

export default useSound;
