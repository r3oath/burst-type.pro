import './globals.css';
import { Fira_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';

const fira = Fira_Mono({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata: Metadata = {
  title: 'Burst Type Pro',
  description: 'Practice typing the most common words to build burst speed and muscle memory.',
  openGraph: {
    type: 'website',
    title: 'Burst Type Pro',
    description: 'Practice typing the most common words to build burst speed and muscle memory.',
    images: ['https://www.burst-type.pro/images/og.jpg'],
    url: 'https://www.burst-type.pro/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={fira.className}>
        {children}
        <Analytics/>
      </body>
    </html>
  )
}
