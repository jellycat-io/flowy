import type { Metadata } from 'next';
import { Quicksand } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';

import { auth } from '@/auth';
import { ThemeProvider } from '@/components/theme/theme-provider';

const fontSans = Quicksand({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Flowy',
    template: `%s | Flowy`,
  },
  description: 'With Flowy, where tasks flow, ideas grow.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
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
