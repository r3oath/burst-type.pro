'use client';

import {useAppState} from '@app/config/state';
import {Credits, Finished, Footer, Instructions, LevelMap, Loader, Menu, WordVisualiser} from '@app/components';
import {useKeys, useSaveState, useConfetti, useSound} from '@app/hooks';

const Home = (): React.ReactElement => {
	const [state] = useAppState();
	const loadedState = useSaveState();

	useConfetti();
	useSound();
	useKeys();

	if (!loadedState) {
		return <Loader/>;
	}

	return (
		<main className={state.darkMode ? 'dark' : ''}>
			<div className="flex items-center justify-center w-full h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors">
				<Finished/>
				<WordVisualiser/>
				<Menu/>
				<LevelMap/>
				<Footer/>
				<Instructions/>
				<Credits/>
			</div>
		</main>
	);
};

export default Home;
