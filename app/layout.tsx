import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';

import './globals.css';
import { ThemeProvider } from '@/components/theme/theme-provider';

const fontSans = Quicksand({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Flowy',
  description: 'A project board that helps you organize your work.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
  );
}
