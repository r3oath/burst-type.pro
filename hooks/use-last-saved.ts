'use client';

import {useEffect, useState} from 'react';
import type {State} from '@app/config/state';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo('en-US');

const useLastSaved = (state: State): string => {
	const [lastSaved, setLastSaved] = useState('never');

	useEffect(() => {
		setLastSaved(timeAgo.format(state.lastSave ?? 0));

		const interval = setInterval(() => {
			setLastSaved(timeAgo.format(state.lastSave ?? 0));
		}, 10_000);

		return () => {
			clearInterval(interval);
		};
	}, [state.lastSave]);

	return lastSaved;
};

export default useLastSaved;
