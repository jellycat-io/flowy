import { Jua } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

const fontHeading = Jua({ weight: '400', subsets: ['latin'] });

interface LogoProps {
  isFull?: boolean;
  withLabel?: boolean;
  hideOnMobile?: boolean;
}

export function Logo({
  isFull = false,
  withLabel = false,
  hideOnMobile = false,
}: LogoProps) {
  return (
    <Link href='/'>
      <div
        className={cn(
          'hover:opacity-75 transition items-center gap-x-2 md:flex',
          hideOnMobile && 'hidden',
        )}
      >
        <Image
          src={`/flowy-logo${isFull ? '-full' : ''}.svg`}
          alt='Flowy'
          width={30}
          height={30}
        />
        {withLabel && (
          <p className={cn(fontHeading.className, 'text-lg')}>Flowy</p>
        )}
      </div>
    </Link>
  );
}
