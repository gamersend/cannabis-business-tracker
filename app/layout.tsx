import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MobileNav } from '@/components/MobileNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '🌿 Cannabis Business Tracker',
  description: 'Keep track of your green empire, one nug at a time 💚',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="fixed inset-0 z-[-1] bg-synthwave-grid opacity-40 pointer-events-none"></div>
        <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-transparent via-deep-bg/50 to-deep-bg pointer-events-none"></div>
        <main className="min-h-screen flex flex-col items-center justify-between p-4 md:p-24 relative z-10">
          {children}
        </main>
        <MobileNav />
      </body>
    </html>
  )
}
