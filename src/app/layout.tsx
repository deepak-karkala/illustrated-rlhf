import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

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
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold">RLHF Guide</h1>
              </div>
              <nav className="flex items-center space-x-6">
                <a href="/" className="text-sm font-medium hover:text-primary">
                  Home
                </a>
                <a href="/modules" className="text-sm font-medium hover:text-primary">
                  Modules
                </a>
                <a href="/playground" className="text-sm font-medium hover:text-primary">
                  Playground
                </a>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built with Next.js and Tailwind CSS. Open source educational project.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
