let announcer: HTMLDivElement | null = null;

function getAnnouncer(): HTMLDivElement {
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
  }
  return announcer;
}

export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const el = getAnnouncer();
  el.setAttribute('aria-live', priority);
  el.textContent = message;
  
  setTimeout(() => {
    el.textContent = '';
  }, 1000);
}

export function announceNavigation(pageName: string) {
  announce(`Navigated to ${pageName}`);
}

export function announceError(error: string) {
  announce(error, 'assertive');
}

export function announceSuccess(message: string) {
  announce(message, 'polite');
}
