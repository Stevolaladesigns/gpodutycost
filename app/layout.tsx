import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ghana Post Duty Cost Portal',
  description: 'A portal for Ghana Post to calculate duty costs via Zonos API, manage users by post office, and view transaction reports.',
  icons: {
    icon: '/icon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gp-light text-[#1a1a1a]`}>{children}</body>
    </html>
  )
}
