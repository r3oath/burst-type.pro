'use client';

import {useMemo} from 'react';
import {useAppState, type State} from '@app/config/state';
import {useLastSaved} from '@app/hooks';
import en1000 from '../wordlists/en1000.json';

const indicatorClasses = (index: number, state: State): string => {
	if (index === state.level) {
		return 'bg-neutral-900 dark:bg-neutral-100 animate-pulse';
	}

	if (index < state.level) {
		return 'bg-green-500 dark:bg-green-500';
	}

	if (index <= (state.highestLevel ?? 0)) {
		return 'bg-green-300 dark:bg-green-900';
	}

	return 'bg-neutral-200 dark:bg-neutral-800';
};

const LevelMap = (): React.ReactElement => {
	const [state] = useAppState();
	const lastSaved = useLastSaved();

	const wordlist = useMemo(() => state.customWordlist ?? en1000, [state.customWordlist]);

	return (
		<div className="fixed flex justify-center bottom-0 w-full px-10 mb-24">
			<div className="relative inline-flex flex-wrap gap-0.5 max-w-[750px] justify-center mx-auto min-w-[500px]">
				{wordlist.map((word, index) => (
					<div key={word} className={`w-1 h-1 ${indicatorClasses(index, state)}`}/>
				))}
				<div className="absolute h-4 bottom-0 -mb-8 w-full border-l-2 border-b-2 border-r-2 border-neutral-300 dark:border-neutral-800 rounded-b-md text-center">
					<span className="flex items-center gap-2 absolute top-0 left-[50%] -translate-x-[50%] bg-neutral-50 dark:bg-neutral-900 -mb-5 px-3 text-neutral-400 dark:text-neutral-600 text-xs font-bold uppercase transition-colors">
						<span className="mt-1.5">
							{`Last saved ${lastSaved}`}
						</span>
					</span>
				</div>
				<div className="absolute h-4 top-0 -mt-8 w-full border-l-2 border-t-2 border-r-2 border-neutral-300 dark:border-neutral-800 rounded-t-md text-center">
					<span className="absolute top-0 left-[50%] -translate-x-[50%] bg-neutral-50 dark:bg-neutral-900 -mt-2.5 px-3 font-bold uppercase text-sm text-neutral-500 dark:text-neutral-500 transition-colors">
						{`Words discovered (${(state.highestLevel ?? 0) + 1}/${wordlist.length})`}
					</span>
				</div>
			</div>
		</div>
	);
};

export default LevelMap;
