'use client';

import {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import type {Optional, State} from '@app/config/state';
import {captureEvent, initialState, useAppState} from '@app/config/state';

const useSaveState = (): boolean => {
	const [state, dispatch] = useAppState();
	const [loadedState, setLoadedState] = useState(false);
	const router = useRouter();

	const onLoadState = useCallback((state: State): void => {
		dispatch({type: 'LOAD_STATE', payload: state});
	}, [dispatch]);

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

				onLoadState({
					...initialState,
					lastSave: Date.now(),
				});
			} else {
				const state = JSON.parse(localStorageState as string) as Optional<State>;

				const payload: State = {
					...initialState,
					...state,
					...captureEvent('loadState'),
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
					onLoadState(payload);
				}
			}

			setLoadedState(true);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadedState, state.lastSave]);

	return loadedState;
};

export default useSaveState;
