import {useEffect, useState} from 'react';

type CreditsProperties = {
	onToggleShowCredits: () => void;
};

type Contributor = {
	id: number;
	login: string;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	html_url: string;
	type: string;
	// eslint-disable-next-line @typescript-eslint/naming-convention
	avatar_url: string;
};

const blacklist = new Set(['r3oath']);

const Credits = ({onToggleShowCredits: handleToggleShowCredits}: CreditsProperties): React.ReactElement => {
	const [contributors, setContributors] = useState<Contributor[]>([]);

	console.log(contributors);

	useEffect(() => {
		const fetchContributors = async (): Promise<void> => {
			const response = await fetch('https://api.github.com/repos/r3oath/burst-type.pro/contributors');
			const data = await response.json() as Contributor[];

			setContributors(data.filter((contributor) => !blacklist.has(contributor.login) && contributor.type !== 'Bot'));
		};

		fetchContributors();
	}, []);

	return (
		<div className="fixed flex items-center justify-center inset-0 w-full h-full bg-neutral-100 dark:bg-neutral-900 bg-opacity-80 backdrop-blur-md z-50">
			<div className="mx-auto w-full max-w-xl">
				<h2 className="text-neutral-900 dark:text-neutral-100 uppercase text-4xl font-bold">Credits</h2>
				<div className="mt-6 flex flex-col">
					<p className="text-neutral-900 dark:text-neutral-100">
						BurstType was initially designed and built by
						{' '}
						<a className="text-blue-500 hover:underline" href="https://www.pixls.com.au/">Triso</a>
						{' '}
						to learn the
						{' '}
						<a className="text-blue-500 hover:underline" href="https://colemak.com/">Colemak</a>
						{' '}
						keyboard layout while building burst speed and muscle memory.
					</p>
					<p className="mt-4 text-neutral-900 dark:text-neutral-100">
					Special thanks to the following contributors for their help in making BurstType even better:
					</p>
					{contributors.length === 0 && (
						<p className="mt-4 text-neutral-500 dark:text-neutral-500">
							Loading...
						</p>
					)}
					{contributors.length > 0 && (
						<ul className="mt-6 flex flex-wrap gap-4 items-center text-neutral-900 dark:text-neutral-100">
							{contributors.map((contributor) => (
								<li key={contributor.id}>
									<a className="flex items-center gap-2 text-blue-500 hover:underline" href={contributor.html_url}>
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img className="w-7 h-7 rounded-full" src={contributor.avatar_url} alt={contributor.login}/>
										<span>{contributor.login}</span>
									</a>
								</li>
							))}
						</ul>
					)}
				</div>
				<div className="mt-8 flex flex-col">
					<button className="w-full px-4 py-2 text-neutral-900 dark:text-neutral-200 bg-neutral-300 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border-2 border-neutral-400 dark:border-neutral-700 rounded-md" type="button" onClick={handleToggleShowCredits}>Close</button>
				</div>
			</div>
		</div>
	);
};

export default Credits;
