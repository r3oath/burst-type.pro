import './globals.css';
import {Fira_Mono} from 'next/font/google';
import type {Metadata} from 'next';
import {Analytics} from '@vercel/analytics/react';
import {SpeedInsights} from '@vercel/speed-insights/next';
import {AppState} from '@app/config/state';

const fira = Fira_Mono({subsets: ['latin'], weight: ['400', '700']});

export const metadata: Metadata = {
	title: 'Burst Type',
	description: 'Practice typing the most common words to build burst speed and muscle memory.',
	icons: {
		icon: [
			{url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png'},
			{url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png'},
		],
		apple: '/apple-touch-icon.png',
	},
	manifest: '/site.webmanifest',
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
				<AppState>
					{children}
				</AppState>
				<Analytics/>
				<SpeedInsights/>
			</body>
		</html>
	);
};

export default RootLayout;
