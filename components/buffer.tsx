import type {ChangeEvent} from 'react';
import {useCallback, useEffect, useRef} from 'react';
import {useAppState} from '@app/config/state';

const Buffer = (): React.ReactElement => {
	const [state, dispatch] = useAppState();
	const reference = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (reference.current === null) {
			return;
		}

		if (state.focused) {
			reference.current.focus();
		} else {
			reference.current.blur();
		}
	}, [state.focused]);

	const handleOnChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
		event.preventDefault();
		event.stopPropagation();

		dispatch({type: 'SET_BUFFER', payload: event.target.value});
	}, [dispatch]);

	const handleOnBlur = useCallback((): void => {
		dispatch({type: 'SET_FOCUS', payload: false});
	}, [dispatch]);

	const handleOnFocus = useCallback((): void => {
		dispatch({type: 'SET_FOCUS', payload: true});
	}, [dispatch]);

	return (
		<input
			ref={reference}
			className="m-0 p-0 w-0 h-0 opacity-0 absolute top-0 left-0 z-[-1]"
			type="text"
			tabIndex={-1}
			autoComplete="off"
			autoCapitalize="off"
			autoCorrect="off"
			data-gramm="false"
			data-gramm_editor="false"
			data-enable-grammarly="false"
			list="autocompleteOff"
			spellCheck="false"
			value={state.buffer}
			onChange={handleOnChange}
			onBlur={handleOnBlur}
			onFocus={handleOnFocus}
		/>
	);
};

export default Buffer;
