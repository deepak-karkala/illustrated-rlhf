import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import 'katex/dist/katex.min.css';
import './globals.css';

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { AnalogyProvider } from '@/lib/analogy-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RLHF Illustrated Guide',
  description: 'An interactive visual guide to Reinforcement Learning from Human Feedback (RLHF)',
  keywords: ['RLHF', 'Reinforcement Learning', 'Human Feedback', 'Machine Learning', 'AI'],
  authors: [{ name: 'RLHF Guide Team' }],
  openGraph: {
    title: 'RLHF Illustrated Guide',
    description: 'An interactive visual guide to Reinforcement Learning from Human Feedback (RLHF)',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RLHF Illustrated Guide',
    description: 'An interactive visual guide to Reinforcement Learning from Human Feedback (RLHF)',
  },
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <AnalogyProvider>
            <div className="relative flex min-h-screen flex-col">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
              >
                Skip to main content
              </a>
              <SiteHeader />

              <main id="main-content" className="flex-1">
                <div className="container px-4 py-6 space-y-6">
                  <Breadcrumbs />
                  {children}
                </div>
              </main>

              <SiteFooter />
            </div>
          </AnalogyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
