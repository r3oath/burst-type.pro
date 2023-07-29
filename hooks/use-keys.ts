'use client';

import {useCallback, useEffect} from 'react';
import {useAppState} from '@app/config/state';

const useKeys = (): void => {
	const [, dispatch] = useAppState();

	const onType = useCallback((key: string): void => {
		dispatch({type: 'APPEND_BUFFER', payload: key});
	}, [dispatch]);

	const onJumpBackwards = useCallback((): void => {
		dispatch({type: 'JUMP_BACKWARDS'});
	}, [dispatch]);

	const onJumpForwards = useCallback((): void => {
		dispatch({type: 'JUMP_FORWARDS'});
	}, [dispatch]);

	const onJumpStart = useCallback((): void => {
		dispatch({type: 'JUMP_START'});
	}, [dispatch]);

	const onJumpEnd = useCallback((): void => {
		dispatch({type: 'JUMP_END'});
	}, [dispatch]);

	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent): void => {
			if (event.key === ' ' || /^[a-z]$/.test(event.key)) {
				onType(event.key);
			}

			if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
				onJumpBackwards();
			}

			if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
				onJumpForwards();
			}

			if (event.key === 'Home') {
				onJumpStart();
			}

			if (event.key === 'End') {
				onJumpEnd();
			}

			if (event.key === 'Tab' || event.key === 'Enter') {
				event.preventDefault();
				onType(' ');
			}
		};

		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [onType, onJumpBackwards, onJumpEnd, onJumpForwards, onJumpStart]);
};

export default useKeys;
