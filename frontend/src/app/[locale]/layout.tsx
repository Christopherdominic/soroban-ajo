import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../../styles/globals.css';
import { Providers } from '../providers';
import { AppLayout } from '@/components/AppLayout';
import { InstallPrompt } from '@/components/InstallPrompt';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { locales } from '@/i18n';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ajo - Decentralized Savings Groups',
  description: 'Join and manage savings groups on the Stellar blockchain',
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
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ajo',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ajo" />
      </head>
      <body className={inter.className}>
        <div className="pattern-overlay gradient-mesh min-h-screen">
          <NextIntlClientProvider messages={messages}>
            <Providers>
              <AppLayout>{children}</AppLayout>
              <InstallPrompt />
              <OfflineIndicator />
            </Providers>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
