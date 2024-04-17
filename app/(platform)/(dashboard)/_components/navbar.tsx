import Link from 'next/link';

import { Logo } from '@/components/logo';
import { OrgSwitcher } from '@/components/org/org-switcher';
import { Button } from '@/components/ui/button';
import { UserButton } from '@/components/user-button';

export function Navbar() {
  return (
    <nav className='fixed z-50 top-0 w-full h-14 px-4 border-b shadow-sm bg-background flex items-center justify-between'>
      <div className='flex flex-1 items-center gap-x-4'>
        <Button>Create</Button>
      </div>
      <div className='hidden md:flex flex-1 justify-center'>
        <Link href='/'>
          <Logo isFull />
        </Link>
      </div>
      <div className='flex flex-1 items-center gap-x-4'>
        <OrgSwitcher />
        <UserButton />
      </div>
    </nav>
  );
}
