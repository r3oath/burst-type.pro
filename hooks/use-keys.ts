'use client';

import {useEffect} from 'react';

type UseKeysProperties = {
	onAlpha: (key: string) => void;
	onBackspace: () => void;
	onNext: () => void;
	onJumpBackwards: () => void;
	onJumpForwards: () => void;
	onJumpStart: () => void;
	onJumpEnd: () => void;
};

const useKeys = ({
	onAlpha, onBackspace, onNext, onJumpBackwards, onJumpForwards, onJumpStart, onJumpEnd,
}: UseKeysProperties): void => {
	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent): void => {
			event.preventDefault();

			if (/^[a-z]$/.test(event.key)) {
				onAlpha(event.key);
			}

			if (event.key === 'Backspace') {
				onBackspace();
			}

			if (event.key === ' ' || event.key === 'Tab' || event.key === 'Enter') {
				onNext();
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
	}, [onAlpha, onBackspace, onJumpBackwards, onJumpEnd, onJumpForwards, onJumpStart, onNext]);
};

export default useKeys;
