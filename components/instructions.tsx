'use client';

type InstructionsProperties = {
	onGetStarted: () => void;
};

const Instructions = ({onGetStarted: handleToggleInstructions}: InstructionsProperties): React.ReactElement => (
	<div className="fixed inset-0 flex justify-center items-center bg-neutral-900 bg-opacity-60 backdrop-blur-md">
		<div className="text-center">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-28 h-28 stroke-yellow-400 mx-auto">
				<path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"/>
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"/>
			</svg>
			<h1 className="mt-6 text-7xl font-bold text-green-500">
				<span>Burst</span>
				<span className="text-white">Type</span>
			</h1>
			<p className="mt-16 text-neutral-200 text-xl max-w-3xl mx-auto">
				Instructions
			</p>
			<p className="mt-8 text-neutral-400 max-w-3xl mx-auto">
				<span>Set your desired min</span>
				{' '}
				<span className="text-green-400 font-bold">WPM</span>
				{' '}
				<span>and</span>
				{' '}
				<span className="text-sky-400 font-bold">streak</span>
				{' '}
				<span>count, then type the word you see on the screen. If you complete the word with no mistakes (and at or above your min WPM setting), your streak will increase; otherwise, your streak will reset.</span>
			</p>
			<p className="mt-4 text-neutral-400 max-w-3xl mx-auto">
				<span>Pressing the</span>
				{' '}
				<span className="bg-neutral-700 text-neutral-200 tracking-wider px-2 py-0.5 rounded-md">spacebar</span>
				{' '}
				<span>at the end of a word is required to complete it.</span>
			</p>
			<p className="mt-4 text-neutral-400 max-w-3xl mx-auto">
				<span>Pressing</span>
				{' '}
				<span className="bg-neutral-700 text-neutral-200 tracking-wider px-2 py-0.5 rounded-md">tab/enter</span>
				{' '}
				<span>after you have successfully completed the streak will unlock (discover) the next word in the list.</span>
			</p>
			<p className="mt-4 text-neutral-400 max-w-3xl mx-auto">
				<span>You can use the</span>
				{' '}
				<span className="bg-neutral-700 text-neutral-200 tracking-wider px-2 py-0.5 rounded-md">left/down</span>
				{' '}
				<span>or</span>
				{' '}
				<span className="bg-neutral-700 text-neutral-200 tracking-wider px-2 py-0.5 rounded-md">right/up</span>
				{' '}
				<span>arrow keys to move backwards and forwards through your discovered words. Jump to back to the start or to your latest discovered word using the</span>
				{' '}
				<span className="bg-neutral-700 text-neutral-200 tracking-wider px-2 py-0.5 rounded-md">home</span>
				{' '}
				<span>or</span>
				{' '}
				<span className="bg-neutral-700 text-neutral-200 tracking-wider px-2 py-0.5 rounded-md">end</span>
				{' '}
				<span>keys.</span>
			</p>
			<button className="mt-10 bg-green-600 hover:bg-green-500 text-black font-bold px-5 py-3 rounded-md" type="button" onClick={handleToggleInstructions}>Get Started!</button>
		</div>
	</div>
);

export default Instructions;
