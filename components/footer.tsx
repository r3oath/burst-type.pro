'use client';

import packageJSON from '../package.json';

type Link = {
	href: string;
	label: string;
	icon: (className: string) => React.ReactElement;
};

const links: Link[] = [
	{
		href: 'https://github.com/r3oath/burst-type.pro',
		label: 'GitHub',
		icon: (className: string) => (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
				<path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zm4.03 6.28a.75.75 0 00-1.06-1.06L4.97 9.47a.75.75 0 000 1.06l2.25 2.25a.75.75 0 001.06-1.06L6.56 10l1.72-1.72zm4.5-1.06a.75.75 0 10-1.06 1.06L13.44 10l-1.72 1.72a.75.75 0 101.06 1.06l2.25-2.25a.75.75 0 000-1.06l-2.25-2.25z" clipRule="evenodd"/>
			</svg>
		),
	},
	{
		href: 'https://github.com/r3oath/burst-type.pro/blob/develop/LICENSE',
		label: 'License',
		icon: (className: string) => (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
				<path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd"/>
			</svg>
		),
	},
	{
		href: 'https://github.com/r3oath/burst-type.pro/issues',
		label: 'Issues',
		icon: (className: string) => (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
				<path fillRule="evenodd" d="M6.56 1.14a.75.75 0 01.177 1.045 3.989 3.989 0 00-.464.86c.185.17.382.329.59.473A3.993 3.993 0 0110 2c1.272 0 2.405.594 3.137 1.518.208-.144.405-.302.59-.473a3.989 3.989 0 00-.464-.86.75.75 0 011.222-.869c.369.519.65 1.105.822 1.736a.75.75 0 01-.174.707 7.03 7.03 0 01-1.299 1.098A4 4 0 0114 6c0 .52-.301.963-.723 1.187a6.961 6.961 0 01-1.158.486c.13.208.231.436.296.679 1.413-.174 2.779-.5 4.081-.96a19.655 19.655 0 00-.09-2.319.75.75 0 111.493-.146 21.239 21.239 0 01.08 3.028.75.75 0 01-.482.667 20.874 20.874 0 01-5.153 1.249 2.51 2.51 0 01-.107.247 20.86 20.86 0 015.253 1.257.75.75 0 01.48.74 20.946 20.946 0 01-.907 5.107.75.75 0 01-1.433-.444c.415-1.34.69-2.743.806-4.19-.495-.174-1-.328-1.512-.461.05.284.076.575.076.873 0 1.814-.517 3.312-1.426 4.37A4.639 4.639 0 0110 19a4.64 4.64 0 01-3.574-1.63C5.516 16.311 5 14.813 5 13c0-.298.026-.59.076-.873-.513.133-1.017.287-1.512.46.116 1.448.39 2.85.806 4.191a.75.75 0 01-1.433.444 20.94 20.94 0 01-.908-5.107.75.75 0 01.482-.74 20.857 20.857 0 015.252-1.257 2.481 2.481 0 01-.107-.247 20.874 20.874 0 01-5.153-1.249.75.75 0 01-.482-.667 21.342 21.342 0 01.08-3.028.75.75 0 111.493.146 19.745 19.745 0 00-.09 2.32c1.302.459 2.668.785 4.08.959.066-.243.166-.471.297-.679a6.962 6.962 0 01-1.158-.486A1.348 1.348 0 016 6a4 4 0 01.166-1.143 7.032 7.032 0 01-1.3-1.098.75.75 0 01-.173-.707 5.48 5.48 0 01.822-1.736.75.75 0 011.046-.176z" clipRule="evenodd"/>
			</svg>
		),
	},
	{
		href: 'https://github.com/r3oath/burst-type.pro/blob/main/CHANGELOG.md',
		label: `Version ${packageJSON.version}`,
		icon: (className: string) => (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
				<path fillRule="evenodd" d="M4.606 12.97a.75.75 0 01-.134 1.051 2.494 2.494 0 00-.93 2.437 2.494 2.494 0 002.437-.93.75.75 0 111.186.918 3.995 3.995 0 01-4.482 1.332.75.75 0 01-.461-.461 3.994 3.994 0 011.332-4.482.75.75 0 011.052.134z" clipRule="evenodd"/>
				<path fillRule="evenodd" d="M5.752 12A13.07 13.07 0 008 14.248v4.002c0 .414.336.75.75.75a5 5 0 004.797-6.414 12.984 12.984 0 005.45-10.848.75.75 0 00-.735-.735 12.984 12.984 0 00-10.849 5.45A5 5 0 001 11.25c.001.414.337.75.751.75h4.002zM13 9a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
			</svg>
		),
	},
];

const Footer = (): React.ReactElement => {
	return (
		<div className="fixed flex gap-4 justify-center bottom-0 w-full px-10 mb-5">
			{links.map(({href, label, icon}) => (
				<a key={href} className="flex gap-1 items-center text-sm text-neutral-400 dark:text-neutral-600 hover:text-neutral-800 dark:hover:text-neutral-200 tracking-tighter" href={href}>
					{icon('w-4 h-4')}
					<span>{label}</span>
				</a>
			))}
		</div>
	);
};

export default Footer;
