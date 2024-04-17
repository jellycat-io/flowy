'use client';

import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

import { Button } from '@/components/ui/button';
import { useActiveOrg } from '@/hooks/use-active-org';
import { Routes } from '@/routes';

export function Socials() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const orgId = useActiveOrg();

  function handleClick(provider: 'google' | 'github') {
    signIn(provider, {
      callbackUrl: callbackUrl ?? `${Routes.org}/${orgId}`,
    });
  }

  return (
    <div className='flex items-center w-full gap-x-6'>
      <Button
        size='lg'
        variant='outline'
        className='w-full'
        onClick={() => handleClick('google')}
      >
        <FcGoogle className='h-5 w-5' />
      </Button>
      <Button
        size='lg'
        variant='outline'
        className='w-full'
        onClick={() => handleClick('github')}
      >
        <FaGithub className='h-5 w-5' />
      </Button>
    </div>
  );
}
