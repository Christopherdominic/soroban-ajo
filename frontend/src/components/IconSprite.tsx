/**
 * IconSprite Component
 * 
 * Renders an SVG sprite sheet containing all icon definitions.
 * This component should be placed once in your app root (e.g., in App.tsx)
 * to make all icons available via the Icon component.
 * 
 * Usage:
 * <IconSprite />
 * 
 * Then use icons anywhere:
 * <Icon name="action-add" size={24} variant="default" />
 */

import React from 'react'

export const IconSprite: React.FC = () => {
  return (
    <svg style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* ACTION ICONS */}
        <symbol id="icon-action-add" viewBox="0 0 24 24">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </symbol>

        <symbol id="icon-action-delete" viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </symbol>

        <symbol id="icon-action-edit" viewBox="0 0 24 24">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </symbol>

        <symbol id="icon-action-save" viewBox="0 0 24 24">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </symbol>

        <symbol id="icon-action-download" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </symbol>

        <symbol id="icon-action-upload" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </symbol>

        <symbol id="icon-action-share" viewBox="0 0 24 24">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </symbol>

        <symbol id="icon-action-refresh" viewBox="0 0 24 24">
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36M20.49 15a9 9 0 0 1-14.85 3.36" />
        </symbol>

        {/* STATUS ICONS */}
        <symbol id="icon-status-active" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" fill="currentColor" />
        </symbol>

        <symbol id="icon-status-inactive" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </symbol>

        <symbol id="icon-status-pending" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </symbol>

        <symbol id="icon-status-completed" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </symbol>

        <symbol id="icon-status-warning" viewBox="0 0 24 24">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05l-8.47-14.14a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </symbol>

        <symbol id="icon-status-error" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </symbol>

        <symbol id="icon-status-locked" viewBox="0 0 24 24">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </symbol>

        <symbol id="icon-status-verified" viewBox="0 0 24 24">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </symbol>

        {/* PAYMENT ICONS */}
        <symbol id="icon-payment-wallet" viewBox="0 0 24 24">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <path d="M1 10h22" />
          <circle cx="17" cy="15" r="2" />
        </symbol>

        <symbol id="icon-payment-send" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="1" />
          <path d="M12 1v6m0 6v6" />
          <path d="M4.22 4.22l4.24 4.24m5.08 0l4.24-4.24" />
          <path d="M19.78 4.22l-4.24 4.24m-5.08 0l-4.24-4.24" />
        </symbol>

        <symbol id="icon-payment-receive" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="1" />
          <path d="M12 23v-6m0-6V1" />
          <path d="M4.22 19.78l4.24-4.24m5.08 0l4.24 4.24" />
          <path d="M19.78 19.78l-4.24-4.24m-5.08 0l-4.24 4.24" />
        </symbol>

        <symbol id="icon-payment-coin" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v12" />
          <path d="M15 9a3 3 0 0 0-6 0" />
          <path d="M15 15a3 3 0 0 1-6 0" />
        </symbol>

        <symbol id="icon-payment-card" viewBox="0 0 24 24">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </symbol>

        <symbol id="icon-payment-invoice" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="19" x2="6" y2="19" />
          <line x1="12" y1="15" x2="6" y2="15" />
          <line x1="12" y1="11" x2="6" y2="11" />
        </symbol>

        <symbol id="icon-payment-history" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </symbol>

        <symbol id="icon-payment-calculator" viewBox="0 0 24 24">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <rect x="8" y="6" width="8" height="4" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="16" y2="17" />
          <line x1="12" y1="13" x2="12" y2="17" />
        </symbol>

        {/* NAVIGATION ICONS */}
        <symbol id="icon-nav-home" viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </symbol>

        <symbol id="icon-nav-back" viewBox="0 0 24 24">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </symbol>

        <symbol id="icon-nav-forward" viewBox="0 0 24 24">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </symbol>

        <symbol id="icon-nav-menu" viewBox="0 0 24 24">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </symbol>

        {/* UI ICONS */}
        <symbol id="icon-ui-search" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </symbol>

        <symbol id="icon-ui-settings" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6" />
          <path d="M4.22 4.22l4.24 4.24m5.08 0l4.24-4.24" />
          <path d="M1 12h6m6 0h6" />
          <path d="M4.22 19.78l4.24-4.24m5.08 0l4.24 4.24" />
          <path d="M19.78 4.22l-4.24 4.24m0 5.08l4.24 4.24" />
          <path d="M19.78 19.78l-4.24-4.24m0-5.08l4.24-4.24" />
        </symbol>

        <symbol id="icon-ui-help" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 17v.01" />
          <path d="M12 13a2 2 0 0 0-2-2 2 2 0 0 0-2 2c0 1 1 2 2 3s2 1 2 2" />
        </symbol>

        <symbol id="icon-ui-close" viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </symbol>

        {/* SOCIAL ICONS */}
        <symbol id="icon-social-user" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </symbol>

        <symbol id="icon-social-users" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </symbol>

        {/* CHART ICONS */}
        <symbol id="icon-chart-bar" viewBox="0 0 24 24">
          <line x1="12" y1="20" x2="12" y2="10" />
          <line x1="18" y1="20" x2="18" y2="4" />
          <line x1="6" y1="20" x2="6" y2="16" />
        </symbol>

        <symbol id="icon-chart-line" viewBox="0 0 24 24">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 17" />
          <polyline points="17 6 23 6 23 12" />
        </symbol>

        {/* VALIDATION ICONS */}
        <symbol id="icon-validation-check" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </symbol>

        <symbol id="icon-validation-cross" viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </symbol>
      </defs>
    </svg>
  )
}

export default IconSprite
