import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { Providers } from './providers'
import { AppLayout } from '@/components/AppLayout'
import { InstallPrompt } from '@/components/InstallPrompt'
import { OfflineIndicator } from '@/components/OfflineIndicator'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ajo - Decentralized Savings Groups',
  description: 'Join and manage savings groups on the Stellar blockchain',
  keywords: ['savings', 'groups', 'stellar', 'blockchain', 'decentralized', 'rotational savings'],
  authors: [{ name: 'Soroban Ajo Team' }],
  creator: 'Soroban Ajo',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/icon-192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/icon-512.png',
      },
    ],
  },
  openGraph: {
    title: 'Ajo - Decentralized Savings Groups',
    description: 'Join and manage savings groups on the Stellar blockchain',
    url: 'https://ajo.stellar.org',
    siteName: 'Ajo',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ajo - Decentralized Savings Groups',
    description: 'Join and manage savings groups on the Stellar blockchain',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ajo',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1f2937" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Ajo" />
      </head>
      <body className={inter.className}>
        <div className="pattern-overlay gradient-mesh min-h-screen">
          <Providers>
            <AppLayout>{children}</AppLayout>
            <InstallPrompt />
            <OfflineIndicator />
          </Providers>
        </div>
      </body>
    </html>
  )
}
