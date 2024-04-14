import { DoorOpen } from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { Routes } from '@/routes';

export function Navbar() {
  return (
    <nav className='sticky top-0 w-full z-20 h-14 px-4 border-b shadow-sm flex items-center bg-background'>
      <div className='md:max-w-screen-2xl mx-auto flex items-center w-full justify-between'>
        <Logo isFull withLabel hideOnMobile />
        <div className='flex space-x-4 md:w-auto items-center justify-between w-full'>
          <Button size='sm' asChild>
            <Link href={Routes.auth.login}>
              <DoorOpen className='w-4 h-4 mr-2' />
              Sign in
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
