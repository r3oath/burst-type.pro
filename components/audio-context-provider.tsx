'use client';
import {useEffect, useState} from 'react';
import {Context} from '../contexts/audio';

export const AudioContextProvider = ({children}: {children: React.ReactNode}): JSX.Element => {
	const [audioContext, setAudioContext] = useState<AudioContext>();

	useEffect(() => {
		// Create and set up the AudioContext when the component mounts
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const context = new AudioContext();
		setAudioContext(context);

		// Clean up the AudioContext when the component unmounts
		return () => {
			context.close().catch((error) => {
				console.error('Error closing AudioContext:', error);
			});
		};
	}, []);

	useEffect(() => {
		console.log('new audioContext', audioContext);
	}, [audioContext]);

	return (
		<Context.Provider value={audioContext}>
			{children}
		</Context.Provider>
	);
};

