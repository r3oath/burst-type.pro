'use client';

import {useEffect} from 'react';

type UseKeysProperties = {
	onType: (key: string) => void;
	onResetWord: () => void;
	onJumpBackwards: () => void;
	onJumpForwards: () => void;
	onJumpStart: () => void;
	onJumpEnd: () => void;
};

const useKeys = ({
	onType, onResetWord, onJumpBackwards, onJumpForwards, onJumpStart, onJumpEnd,
}: UseKeysProperties): void => {
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent): void => {
			event.preventDefault();

			if (event.key === ' ' || /^[a-z]$/.test(event.key)) {
				onType(event.key);
			}

			if (event.key === 'Tab' || event.key === 'Enter') {
				onResetWord();
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
		};

		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [onType, onJumpBackwards, onJumpEnd, onJumpForwards, onJumpStart, onResetWord]);
};

export default useKeys;
