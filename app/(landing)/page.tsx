import { Rocket } from 'lucide-react';
import { Jua } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Routes } from '@/routes';

import LogoFull from '../../public/flowy-logo-full.svg';

const fontHeading = Jua({ weight: '400', subsets: ['latin'] });

export default function LandingPage() {
  return (
    <div className='flex items-center justify-center flex-col space-y-6'>
      <div className='flex items-center justify-center flex-col space-y-6'>
        <div className='flex items-center justify-center gap-4'>
          <Image src={LogoFull} alt='Flowy' width={96} height={96} />
          <h1 className={cn(fontHeading.className, 'text-6xl')}>Flowy</h1>
        </div>
        <h1
          className={cn(
            fontHeading.className,
            'flex flex-col items-center justify-center space-y-2',
          )}
        >
          <span className='text-3xl md:text-5xl text-center'>
            Where tasks flow,
          </span>
          <span className='text-3xl md:text-5xl bg-gradient-to-r from-sky-400 to-amber-500 rounded-md px-4 py-2 pb-4 w-fit text-white'>
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
