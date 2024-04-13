import type { Metadata } from 'next';
import { Lato, Nunito, Open_Sans, Quicksand } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../public/flowy-logo-full.svg';
import LogoDark from '../public/flowy-logo-dark.svg';

const openSans = Nunito({ weight: '400', subsets: ['latin'] });

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
    <html lang='en'>
      <body className={openSans.className}>
        <nav className='bg-secondary flex justify-center p-3'>
          <Link href='/'>
            <Image
              priority
              src={Logo}
              alt='logo'
              className='w-8'
              quality={100}
            />
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
