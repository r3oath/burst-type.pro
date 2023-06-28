import './globals.css'
import { Fira_Mono } from 'next/font/google'

const fira = Fira_Mono({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata = {
  title: 'Descent',
  description: 'Descent typing game',
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
