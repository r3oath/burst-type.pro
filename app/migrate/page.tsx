'use client';

import {useEffect} from 'react';
import {useSearchParams, useRouter} from 'next/navigation';
import type {Optional, State} from '@app/config/state';
import {createWord, initialState} from '@app/config/state';
import wordlist from '../../config/wordlist.json';

const Migrate = (): React.ReactElement => {
	const parameters = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		const localStorageState = localStorage.getItem('state') as unknown;

		if (localStorageState !== null) {
			router.push('/');

			return;
		}

		const s = parameters.get('s');

		if (s !== null) {
			const data = JSON.parse(atob(s))	as Optional<State>;
			const state = {
				...initialState,
				...data,
				word: createWord(wordlist[data.level ?? 0]),
			};

			localStorage.setItem('state', JSON.stringify(state));
			router.push('/');
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<main className="flex items-center justify-center w-full h-screen bg-neutral-900 text-neutral-200">
			<h1>Migrating your saved progress, please wait...</h1>
		</main>
	);
};

export default Migrate;
