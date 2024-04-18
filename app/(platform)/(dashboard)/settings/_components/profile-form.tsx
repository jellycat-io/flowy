import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, Save } from 'lucide-react';
import { Session } from 'next-auth';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { UpdateProfileSchema } from '@/actions/settings/schemas';
import { updateProfile } from '@/actions/settings/update-profile';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAction } from '@/hooks/use-action';
import { ExtendedUser } from '@/next-auth';

interface ProfileFormProps {
  user: ExtendedUser;
  onUpdateSuccess: () => void;
}

export function ProfileForm({ user, onUpdateSuccess }: ProfileFormProps) {
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
        onUpdateSuccess();
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
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          name='name'
          control={control}
          render={({ field }) => (
            <FormItem className=''>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Your name may appear around Flowy where you contribute or are
                mentioned.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {user.isOAuth === false && (
          <FormField
            name='email'
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' {...field} />
                </FormControl>
                <FormDescription>
                  You will receive a verification email upon updating your
                  email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className='flex space-x-2 justify-end'>
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
              <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Save className='mr-2 w-4 h-4' />
            )}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
