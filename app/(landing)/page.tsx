'use client';

import { Rocket } from 'lucide-react';
import { Lato } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes';

const fontHeading = Lato({ weight: '700', subsets: ['latin'] });

export default function LandingPage() {
  const { theme } = useTheme();

  return (
    <div className='flex items-center justify-center flex-col space-y-6'>
      <div className='flex items-center justify-center flex-col space-y-6'>
        <div className='flex items-center justify-center gap-4'>
          <Image
            src={`/flowy-logo${theme === 'dark' ? '-dark' : ''}.svg`}
            alt='Flowy'
            width={64}
            height={64}
          />
          <h1 className={cn(fontHeading.className, 'text-5xl')}>Flowy</h1>
        </div>
        <h1
          className={cn(
            fontHeading.className,
            'flex flex-col items-center justify-center space-y-4',
          )}
        >
          <span className='text-3xl md:text-5xl text-center'>
            Where tasks flow,
          </span>
          <span className='text-3xl md:text-5xl bg-primary rounded-md px-4 py-2 pb-4 w-fit text-primary-foreground'>
            ideas grow.
          </span>
        </h1>
      </div>
      <h2 className='text-sm md:text-xl text-neutral-400 max-w-xs md:max-w-2xl text-center mx-auto'>
        Collaborate, manage projects, and reach new productivity peaks. From
        high rises to the home office, the way your team works is unique —
        accomplish it all with Flowy.
      </h2>
      <Button size='lg' asChild>
        <Link href={Routes.auth.register}>
          <Rocket className='w-4 h-4 mr-2' />
          Get Flowy for free
        </Link>
      </Button>
    </div>
  );
}
