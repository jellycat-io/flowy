import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

import { ThemeProvider } from '@/components/theme/theme-provider';

const fontSans = Quicksand({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Flowy',
    template: `%s | Flowy`,
  },
  description: 'With Flowy, where tasks flow, ideas grow.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang='en' suppressHydrationWarning>
        <body className={fontSans.className} suppressHydrationWarning>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
