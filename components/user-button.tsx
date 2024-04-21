'use client';

import { DoorOpen, Moon, Palette, Sun, SunMoon, User } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import { LogoutButton } from '@/components/auth/logout-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useActiveUser } from '@/hooks/use-active-user';

export function UserButton() {
  const user = useActiveUser();
  const { theme, setTheme } = useTheme();

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
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className='mr-2 h-4 w-4' />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent sideOffset={10}>
              <DropdownMenuCheckboxItem
                checked={theme === 'light'}
                onCheckedChange={() => setTheme('light')}
              >
                <Sun className='mr-2 h-4 w-4' />
                Light
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={theme === 'dark'}
                onCheckedChange={() => setTheme('dark')}
              >
                <Moon className='mr-2 h-4 w-4' />
                Dark
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={theme === 'system'}
                onCheckedChange={() => setTheme('system')}
              >
                <SunMoon className='mr-2 h-4 w-4' />
                System
              </DropdownMenuCheckboxItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <Link href='/settings'>
            <DropdownMenuItem>
              <User className='mr-2 h-4 w-4' />
              Settings
            </DropdownMenuItem>
          </Link>
          <LogoutButton>
            <DropdownMenuItem>
              <DoorOpen className='mr-2 h-4 w-4' />
              Sign out
            </DropdownMenuItem>
          </LogoutButton>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
