'use client';

import { Lato } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

const fontHeading = Lato({ weight: '700', subsets: ['latin'] });

interface LogoProps {
  isFull?: boolean;
  withLabel?: boolean;
  hideOnMobile?: boolean;
}

export function Logo({ withLabel = false, hideOnMobile = false }: LogoProps) {
  const { theme } = useTheme();
  return (
    <Link href='/'>
      <div
        className={cn(
          'hover:opacity-75 hover:-translate-y-0.5 transition items-center gap-x-2 md:flex',
          hideOnMobile && 'hidden',
        )}
      >
        <Image
          src={`/flowy-logo${theme === 'dark' ? '-dark' : ''}.svg`}
          alt='Flowy'
          width={30}
          height={30}
        />
        {withLabel && (
          <p className={cn(fontHeading.className, 'text-xl')}>Flowy</p>
        )}
      </div>
    </Link>
  );
}
