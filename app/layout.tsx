import './globals.css'
import { Fira_Mono } from 'next/font/google'
import type { Metadata } from 'next'

const fira = Fira_Mono({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata: Metadata = {
  title: 'Descent Type Training',
  description: 'Practice typing the most common English words to build burst speed and muscle memory.',
  openGraph: {
    type: 'website',
    title: 'Descent Type Training',
    description: 'Practice typing the most common English words to build burst speed and muscle memory.',
    images: ['https://descent-typing.vercel.app/images/descent.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={fira.className}>{children}</body>
    </html>
  )
}
