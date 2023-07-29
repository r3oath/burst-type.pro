'use client';

import {useEffect} from 'react';
import {useAppState} from '@app/config/state';

const useKeys = (): void => {
	const [, dispatch] = useAppState();

	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent): void => {
			if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
				dispatch({type: 'JUMP_BACKWARDS'});
			}

			if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
				dispatch({type: 'JUMP_FORWARDS'});
			}

			if (event.key === 'Home') {
				dispatch({type: 'JUMP_START'});
			}

			if (event.key === 'End') {
				dispatch({type: 'JUMP_END'});
			}

			if (event.key === 'Tab' || event.key === 'Enter') {
				dispatch({type: 'HANDLE_CANCEL', payload: event});
			}

			if (event.key === 'Escape') {
				dispatch({type: 'SET_FOCUS', payload: false});
			}
		};

		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [dispatch]);
};

export default useKeys;
