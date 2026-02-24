'use client';

import { useLocale, useTranslations } from 'next-intl';
import { locales, type Locale } from '@/i18n';
import { useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSelector() {
  const t = useTranslations('language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;

    // Store preference
    localStorage.setItem('preferredLocale', newLocale);

    // Update URL
    startTransition(() => {
      const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
      router.replace(newPath);
    });
  };

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        disabled={isPending}
        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        aria-label={t('select')}
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {t(loc)}
          </option>
        ))}
      </select>
    </div>
  );
}
