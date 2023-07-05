'use client';

type Theme = 'blue' | 'green' | 'red';

type ThemeConfig = {
	enabled: string;
	base: string;
};

type MenuButtonProperties = {
	label: string;
	value: number | string;
	onClick: () => void;
	enabled?: boolean;
	theme?: 'blue' | 'green' | 'red';
};

const sharedClasses = 'relative flex flex-col items-center w-16 py-3 border-2 rounded-md';

const themeClasses: Record<Theme, ThemeConfig> = {
	blue: {
		enabled: 'border-sky-500 dark:border-sky-500 text-sky-600 dark:text-sky-400 bg-sky-100 dark:bg-sky-950 after:content-[""] after:absolute after:bottom-0 after:-mb-3 after:border-sky-500 dark:after:border-sky-500 after:w-1/3 after:border-b-4 after:rounded-full',
		base: 'border-neutral-400 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-sky-500 dark:hover:border-sky-500 hover:text-sky-700 dark:hover:text-sky-400',
	},
	green: {
		enabled: 'border-green-500 dark:border-green-500 text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-950 after:content-[""] after:absolute after:bottom-0 after:-mb-3 after:border-green-500 dark:after:border-green-500 after:w-1/3 after:border-b-4 after:rounded-full',
		base: 'border-neutral-400 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-green-500 dark:hover:border-green-500 hover:text-green-700 dark:hover:text-green-400',
	},
	red: {
		enabled: 'border-red-500 dark:border-red-500 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950 after:content-[""] after:absolute after:bottom-0 after:-mb-3 after:border-red-500 dark:after:border-red-500 after:w-1/3 after:border-b-4 after:rounded-full',
		base: 'border-neutral-400 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-red-500 dark:hover:border-red-500 hover:text-red-700 dark:hover:text-red-400',
	},
};

const MenuButton = ({label, value, onClick: handleOnClick, enabled = false, theme = 'green'}: MenuButtonProperties): React.ReactElement => (
	<button
		type="button"
		className={`${sharedClasses} ${enabled ? themeClasses[theme].enabled : themeClasses[theme].base}`}
		onClick={handleOnClick}
	>
		<span className="font-bold text-lg">{value}</span>
		<span className="text-xs uppercase opacity-80 dark:opacity-60">{label}</span>
	</button>
);

export default MenuButton;

export type {
	Theme,
};
