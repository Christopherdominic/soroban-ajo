import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Drips - Decentralized Savings Groups',
  description: 'Join and manage savings groups on the Stellar blockchain',
  keywords: ['savings', 'groups', 'stellar', 'blockchain', 'decentralized', 'rotational savings'],
  authors: [{ name: 'Soroban Ajo Team' }],
  creator: 'Soroban Ajo',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://soroban-ajo.com',
    title: 'Drips - Decentralized Savings Groups',
    description: 'Join and manage savings groups on the Stellar blockchain',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Drips - Decentralized Savings Groups',
    description: 'Join and manage savings groups on the Stellar blockchain',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1f2937" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
