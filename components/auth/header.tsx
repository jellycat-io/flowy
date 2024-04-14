import { Lock } from 'lucide-react';
import { Jua } from 'next/font/google';
import Image from 'next/image';

import { cn } from '@/lib/utils';

const fontHeading = Jua({ weight: '400', subsets: ['latin'] });

interface HeaderProps {
  label: string;
}

export function Header({ label }: HeaderProps) {
  return (
    <div className='w-full flex flex-col gap-y-4 items-center justify-center'>
      <div className='flex items-center gap-4'>
        <Image
          src='/flowy-logo-full.svg'
          width={48}
          height={48}
          alt='Logo'
          priority
        />
        <h1 className={cn(fontHeading.className, 'text-4xl')}>Flowy</h1>
      </div>
      <p className='text-muted-foreground text-sm'>{label}</p>
    </div>
  );
}
