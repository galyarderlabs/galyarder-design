import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { I18nProvider } from '../src/i18n';
import { AnalyticsProvider } from '../src/analytics/provider';
import '../src/index.css';
import '../src/components/ds/styles.css';
import '../src/styles/home/index.css';

export const metadata: Metadata = {
  title: 'Galyarder Design',
  icons: {
    icon: '/app-icon.png',
    apple: '/app-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#F4EFE6',
};

/**
 * Inline script that runs before React hydrates to apply the saved theme
 * preference without a flash of unstyled content. It reads the same
 * localStorage key used by `state/config.ts` and sets `data-theme` on
 * `<html>` immediately — before any CSS or React paint.
 * Keep the accent variable mix ratios in sync with `accentVars()` in
 * `src/state/appearance.ts`; this script cannot import application modules.
 */
const themeInitScript = `(function(){try{var c=JSON.parse(localStorage.getItem('galyarder-design:config')||'{}');var t=c.theme;var pt=localStorage.getItem('galyarder.theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}else if(pt==='light'||pt==='dark'){document.documentElement.setAttribute('data-theme',pt);}else{document.documentElement.setAttribute('data-theme','dark');}var a=typeof c.accentColor==='string'&&/^#[0-9a-fA-F]{6}$/.test(c.accentColor.trim())?c.accentColor.trim().toLowerCase():'#8A00FF';var s=document.documentElement.style;s.setProperty('--accent',a);s.setProperty('--accent-strong','color-mix(in srgb, '+a+' 86%, var(--text-strong))');s.setProperty('--accent-soft','color-mix(in srgb, '+a+' 22%, var(--bg-panel))');s.setProperty('--accent-tint','color-mix(in srgb, '+a+' 12%, var(--bg-panel))');s.setProperty('--accent-hover','color-mix(in srgb, '+a+' 90%, var(--text-strong))');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' data-theme='dark' suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: intentional theme-init inline script to prevent FOUC */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body suppressHydrationWarning>
        <I18nProvider>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
