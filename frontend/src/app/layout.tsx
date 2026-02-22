import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { Providers } from './providers'
import { ResponsiveLayout } from '@/components/ResponsiveLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Drips - Decentralized Savings Groups',
  description: 'Join and manage savings groups on the Stellar blockchain',
}

const themeScript = `(function(){
  var k='soroban-ajo-theme';
  var v=localStorage.getItem(k);
  var r=v==='dark'?'dark':v==='light'?'light':window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  document.documentElement.classList.add(r);
})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={inter.className}>
        <Providers>
          <ResponsiveLayout>
            {children}
          </ResponsiveLayout>
        </Providers>
      </body>
    </html>
  )
}
