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
        <div className="pb-16 sm:pb-0">
          {children}
        </div>
        <MobileNav />
      </body>
    </html>
  )
}
