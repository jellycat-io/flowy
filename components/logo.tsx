'use client';

import { Lato } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';

import LogoDark from '../public/flowy-logo-dark.svg';
import LogoLight from '../public/flowy-logo.svg';

const fontHeading = Lato({ weight: '700', subsets: ['latin'] });

interface LogoProps {
  withLabel?: boolean;
  hideOnMobile?: boolean;
}

export function Logo({ withLabel = false, hideOnMobile = false }: LogoProps) {
  const { theme } = useTheme();

  const logoSrc = useMemo(
    () => (theme === 'dark' ? LogoDark : LogoLight),
    [theme],
  );

  return (
    <Link href='/'>
      <div
        className={cn(
          'hover:opacity-75 hover:-translate-y-0.5 transition items-center gap-x-2 md:flex',
          hideOnMobile && 'hidden',
        )}
      >
        <Image src={logoSrc} alt='Flowy' width={30} height={30} />
        {withLabel && (
          <p className={cn(fontHeading.className, 'text-xl')}>Flowy</p>
        )}
      </div>
    </Link>
  );
}
