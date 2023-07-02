'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import type {Optional, State} from '@app/config/state';
import {initialState} from '@app/config/state';

const useSaveState = (state: State, onSaveState: (state: State) => void): boolean => {
	const [loadedState, setLoadedState] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const isOnLegacyDomain = window.location.hostname === 'descent-typing.vercel.app';

		if (loadedState) {
			localStorage.setItem('state', JSON.stringify(state));
		}

		if (!loadedState) {
			const localStorageState = localStorage.getItem('state') as unknown;

			if (localStorageState === null) {
				if (isOnLegacyDomain) {
					router.push('https://www.burst-type.pro/');
				}

				onSaveState({
					...initialState,
					lastSave: Date.now(),
				});
			} else {
				const state = JSON.parse(localStorageState as string) as Optional<State>;

				const payload: State = {
					...initialState,
					...state,
					highestLevel: state.highestLevel ?? state.level,
					showInstructions: state.showInstructions ?? true,
					lastSave: Date.now(),
				};

				if (isOnLegacyDomain) {
					const base64State = btoa(JSON.stringify({
						level: payload.level,
						highestLevel: payload.highestLevel,
						targetWPM: payload.targetWPM,
						targetStreak: payload.targetStreak,
					}));

					localStorage.removeItem('state');

					router.push(`https://www.burst-type.pro/migrate?s=${base64State}`);
				} else {
					onSaveState(payload);
				}
			}

			setLoadedState(true);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadedState, state.lastSave]);

	return loadedState;
};

export default useSaveState;
