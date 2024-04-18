'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, Save } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { UpdateProfileSchema } from '@/actions/settings/schemas';
import { updateProfile } from '@/actions/settings/update-profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAction } from '@/hooks/use-action';
import { useActiveUser } from '@/hooks/use-active-user';

export default function SettingsPage() {
  const session = useSession();
  const user = useActiveUser();
  const router = useRouter();

  const form = useForm<z.infer<typeof UpdateProfileSchema>>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email ?? undefined,
    },
  });

  const { control, formState, handleSubmit, reset } = form;

  const { execute: sendProfile, loading: sendingProfile } = useAction(
    updateProfile,
    {
      onSuccess: async (data) => {
        toast.success(data.success);
        session.update();
      },
      onError: (error) => {
        toast.error(error);
      },
    },
  );

  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email ?? undefined,
      });
    }
  }, [user, reset]);

  const onSubmit = (values: z.infer<typeof UpdateProfileSchema>) => {
    sendProfile(values);
  };

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
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            name='name'
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name='email'
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex space-x-2'>
            <Button
              variant='ghost'
              disabled={
                !formState.isDirty || !formState.touchedFields || sendingProfile
              }
              onClick={() => {
                reset();
              }}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={
                !formState.isDirty || !formState.touchedFields || sendingProfile
              }
            >
              {sendingProfile ? (
                <LoaderCircle className='h-4 w-4 animate-spin' />
              ) : (
                <Save className='mr-2 w-4 h-4' />
              )}
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
