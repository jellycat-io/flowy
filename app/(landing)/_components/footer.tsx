import { Heart } from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <nav className='w-full p-4 border-t bg-secondary'>
      <div className='md:max-w-screen-2xl mx-auto flex flex-col items-cemter w-full justify-between'>
        <div className='flex justify-between items-center w-full'>
          <div className='flex items-center space-x-2 mb-2'>
            <Logo />
            <p>&copy; {new Date().getFullYear()}</p>
          </div>
          <p className='flex-1 flex justify-end items-center text-sm text-neutral-400'>
            Made with{' '}
            <Heart className='mx-2 w-4 h-4 text-rose-600 animate-pulse' /> by
            Jellycat
          </p>
        </div>
        <div className='flex flex-col items-start justify-center w-full'>
          <Button size='sm' variant='link' className='p-0' asChild>
            <Link href='/privacy-policy'>Privacy policy</Link>
          </Button>
          <Button size='sm' variant='link' className='p-0' asChild>
            <Link href='/terms-of-service'>Terms of service</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
