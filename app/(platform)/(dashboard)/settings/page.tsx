'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { UpdateProfileSchema } from '@/actions/settings/schemas';
import { updateProfile } from '@/actions/settings/update-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAction } from '@/hooks/use-action';
import { useActiveUser } from '@/hooks/use-active-user';

import { AccountForm } from './_components/account-form';
import { ProfileForm } from './_components/profile-form';

type Tab = {
  id: string;
  title: string;
  Component: React.ComponentProps<any>;
};

const tabs: Tab[] = [
  {
    id: 'profile',
    title: 'Profile',
    Component: ProfileForm,
  },
  {
    id: 'account',
    title: 'Account',
    Component: AccountForm,
  },
];

export default function SettingsPage() {
  const session = useSession();
  const user = useActiveUser();

  if (!user?.id) {
    throw new Error('Unauthorized');
  }

  const [activeTab, setActiveTab] = React.useState<Tab>(tabs[0]);

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
      <Tabs defaultValue='profile' className='w-full'>
        <TabsList className={`grid w-full grid-cols-2`}>
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
        <TabsContent value={activeTab.id} className='py-4'>
          <activeTab.Component
            user={user}
            onUpdateSuccess={() => session.update()}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
