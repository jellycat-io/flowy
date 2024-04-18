import { Plus } from 'lucide-react';

import { Logo } from '@/components/logo';
import { OrgSwitcher } from '@/components/org/org-switcher';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { UserButton } from '@/components/user-button';

export function Navbar() {
  return (
    <nav className='fixed z-50 top-0 w-full h-14 px-4 border-b shadow-sm bg-background flex items-center justify-between'>
      <div className='flex flex-1 items-center gap-x-4'>
        <Button size='sm' className='hidden md:flex'>
          <Plus className='mr-2 w-4 h-4' />
          Create board
        </Button>
        <Button size='iconSm' className='md:hidden'>
          <Plus className='w-4 h-4' />
        </Button>
      </div>
      <div className='hidden md:flex flex-1 justify-center'>
        <Logo isFull withLabel />
      </div>
      <div className='flex flex-1 items-center justify-end gap-x-4'>
        <OrgSwitcher />
        <UserButton />
      </div>
    </nav>
  );
}
