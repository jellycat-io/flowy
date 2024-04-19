'use client';

import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useActiveUser } from '@/hooks/use-active-user';

import { AccountForm } from './_components/account-form';
import { OrgsManager } from './_components/orgs-manager';
import { ProfileForm } from './_components/profile-form';

type Tab = {
  id: string;
  title: string;
};

const tabs: Tab[] = [
  {
    id: 'profile',
    title: 'Profile',
  },
  {
    id: 'account',
    title: 'Account',
  },
  {
    id: 'orgs',
    title: 'Organizations',
  },
];

export default function SettingsPage() {
  const session = useSession();
  const user = useActiveUser();
  const params = useSearchParams();

  if (!user?.id) {
    throw new Error('Unauthorized');
  }

  const initialTab =
    tabs.find((tab) => tab.id === params.get('tab')) ?? tabs[0];

  const [activeTab, setActiveTab] = React.useState<Tab>(initialTab);

  return (
    <div className='p-4 flex flex-col space-y-6'>
      <div className='flex items-center gap-x-4'>
        <Avatar className='w-16 h-16'>
          <AvatarImage src={user?.image ?? ''} alt={user?.name ?? ''} />
          <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col justify-evenly'>
          <h1 className='text-xl'>{user?.name}</h1>
          <div>
            {user?.username && (
              <p className='text-gray-500'>@{user.username}</p>
            )}
          </div>
          <p className='text-gray-500'>{user?.email}</p>
        </div>
      </div>
      <Tabs defaultValue={activeTab.id} className='w-full'>
        <TabsList className={'grid w-full grid-cols-3'}>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              onClick={() => setActiveTab(tab)}
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value='profile' className='py-4'>
          <ProfileForm user={user} onUpdateSuccess={() => session.update()} />
        </TabsContent>
        <TabsContent value='account' className='py-4'>
          <AccountForm user={user} onUpdateSuccess={() => session.update()} />
        </TabsContent>
        <TabsContent value='orgs' className='py-4'>
          <OrgsManager user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
