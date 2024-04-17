'use client';

import { DoorOpen, User } from 'lucide-react';

import { LogoutButton } from '@/components/auth/logout-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useActiveUser } from '@/hooks/use-active-user';

export function UserButton() {
  const user = useActiveUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size='iconSm'
          variant='secondary'
          className='rounded-full cursor-pointer'
          asChild
        >
          <Avatar>
            <AvatarImage src={user?.image ?? ''} alt={user?.name ?? ''} />
            <AvatarFallback>
              {user?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <LogoutButton>
          <DropdownMenuItem>
            <DoorOpen className='mr-2 h-4 w-4' />
            Sign out
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
