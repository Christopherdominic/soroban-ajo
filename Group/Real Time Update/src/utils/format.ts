export function formatAddress(address: string, length: number = 4): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
}

export function formatEther(value: string | number, decimals: number = 4): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return num.toFixed(decimals);
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  if (months < 12) return `${months}mo ago`;
  return `${years}y ago`;
}

export function calculateProgress(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.min((current / total) * 100, 100);
}

export function isAddressEqual(addr1: string, addr2: string): boolean {
  return addr1.toLowerCase() === addr2.toLowerCase();
}
