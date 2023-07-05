import './globals.css';
import {Fira_Mono} from 'next/font/google';
import type {Metadata} from 'next';
import {Analytics} from '@vercel/analytics/react';

const fira = Fira_Mono({subsets: ['latin'], weight: ['400', '700']});

export const metadata: Metadata = {
	title: 'Burst Type',
	description: 'Practice typing the most common words to build burst speed and muscle memory.',
	openGraph: {
		type: 'website',
		title: 'Burst Type',
		description: 'Practice typing the most common words to build burst speed and muscle memory.',
		images: ['https://www.burst-type.pro/images/og.jpg'],
		url: 'https://www.burst-type.pro/',
	},
};

const RootLayout = ({children}: {children: React.ReactNode}): React.ReactElement => {
	return (
		<html lang="en">
			<body className={`antialiased ${fira.className}`}>
				{children}
				<Analytics/>
			</body>
		</html>
	);
};

export default RootLayout;
