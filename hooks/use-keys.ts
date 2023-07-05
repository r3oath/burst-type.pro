'use client';

import {useEffect} from 'react';

type UseKeysProperties = {
	onType: (key: string) => void;
	onJumpBackwards: () => void;
	onJumpForwards: () => void;
	onJumpStart: () => void;
	onJumpEnd: () => void;
};

const useKeys = ({
	onType, onJumpBackwards, onJumpForwards, onJumpStart, onJumpEnd,
}: UseKeysProperties): void => {
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
		};

		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [onType, onJumpBackwards, onJumpEnd, onJumpForwards, onJumpStart]);
};

export default useKeys;
