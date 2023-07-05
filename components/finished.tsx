const Finished = (): React.ReactElement => (
	<div className="text-center">
		<p className="text-8xl">🎉</p>
		<h1 className="mt-6 text-8xl font-bold text-neutral-950 dark:text-neutral-50">Congrats!</h1>
		<p className="mt-8 text-xl font-bold text-neutral-900 dark:text-neutral-100">You have completed the entire word list.</p>
		<p className="text-neutral-600 dark:text-neutral-400">Use your arrow keys to move through the wordlist and continue practicing.</p>
	</div>
);

export default Finished;
