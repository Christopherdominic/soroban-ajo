export function formatCurrency(amount: number, locale: string = 'en'): string {
  const formatter = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 7,
  });
  return `${formatter.format(amount)} XLM`;
}

export function formatDate(date: Date | number, locale: string = 'en', options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
}

export function formatDateTime(date: Date | number, locale: string = 'en'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTime(date: Date | number, locale: string = 'en'): string {
  const now = Date.now();
  const timestamp = typeof date === 'number' ? date : date.getTime();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (years > 0) return rtf.format(-years, 'year');
  if (months > 0) return rtf.format(-months, 'month');
  if (weeks > 0) return rtf.format(-weeks, 'week');
  if (days > 0) return rtf.format(-days, 'day');
  if (hours > 0) return rtf.format(-hours, 'hour');
  if (minutes > 0) return rtf.format(-minutes, 'minute');
  return rtf.format(-seconds, 'second');
}

export function formatNumber(value: number, locale: string = 'en', options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale, options).format(value);
}
