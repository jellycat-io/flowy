import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, Save } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { getUserOrgRoles } from '@/actions/org/get-user-org-roles';
import { UpdateAccountSchema } from '@/actions/settings/schemas';
import { updateAccount } from '@/actions/settings/update-account';
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
import { Switch } from '@/components/ui/switch';
import { useAction } from '@/hooks/use-action';
import { useFetch } from '@/hooks/use-fetch';
import { ExtendedUser } from '@/next-auth';

interface AccountFormProps {
  user: ExtendedUser;
  onUpdateSuccess: () => void;
}

export function AccountForm({ user, onUpdateSuccess }: AccountFormProps) {
  const form = useForm<z.infer<typeof UpdateAccountSchema>>({
    resolver: zodResolver(UpdateAccountSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      confirmNewPassword: '',
      isTwoFactorEnabled: user.isTwoFactorEnabled,
    },
  });

  const { control, formState, handleSubmit, reset } = form;

  const { execute: sendAccount, loading: sendingAccount } = useAction(
    updateAccount,
    {
      onError: (error) => {
        toast.error(error);
      },
      onSuccess: async (data) => {
        toast.success(data.success);
        onUpdateSuccess();
      },
    },
  );

  React.useEffect(() => {
    if (user) {
      reset({
        password: '',
        newPassword: '',
        confirmNewPassword: '',
        isTwoFactorEnabled: user.isTwoFactorEnabled,
      });
    }
  }, [user, reset]);

  const onSubmit = (values: z.infer<typeof UpdateAccountSchema>) => {
    sendAccount(values);
  };

  const { data: userOrgRoles } = useFetch(getUserOrgRoles, {
    userId: user.id!,
  });

  const ownerOrgsNames = userOrgRoles
    ?.filter((role) => role.role === 'OWNER')
    ?.map((org) => org.org.name);

  return (
    <div className='space-y-6'>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {!user.isOAuth && (
            <>
              <FormField
                name='password'
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='password'
                        disabled={sendingAccount}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-x-4'>
                <FormField
                  name='newPassword'
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type='password'
                          disabled={sendingAccount}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='confirmNewPassword'
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm new password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type='password'
                          disabled={sendingAccount}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                name='isTwoFactorEnabled'
                control={control}
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-md border p-4 shadow-sm'>
                    <div className='space-y-0.5'>
                      <FormLabel>Two-factor authentication</FormLabel>
                      <FormDescription>
                        Enable or disable two-factor authentication for your
                        account.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={sendingAccount}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          )}
          <div className='flex space-x-2 justify-end'>
            <Button
              variant='ghost'
              disabled={
                !formState.isDirty || !formState.touchedFields || sendingAccount
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
                !formState.isDirty || !formState.touchedFields || sendingAccount
              }
            >
              {sendingAccount ? (
                <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <Save className='mr-2 w-4 h-4' />
              )}
              Save
            </Button>
          </div>
        </form>
      </Form>
      <div>
        <h2 className='text-xl text-destructive mb-2'>Danger zone</h2>
        <div className='flex flex-col space-y-4 items-start border border-destructive/50 p-4 rounded-sm'>
          {ownerOrgsNames?.length ? (
            <div className='space-y-1.5'>
              <p>
                You are the owner of the following organizations:{' '}
                {ownerOrgsNames.map((name, index) => (
                  <span key={name}>
                    <span className='font-medium'>{name}</span>
                    <span>{index < ownerOrgsNames.length - 1 ? ', ' : ''}</span>
                  </span>
                ))}
                .
              </p>
              <p>
                Please transfer ownership or delete the organization before
                deleting your account.
              </p>
            </div>
          ) : null}
          <p>
            Deleting your account will remove all your data and you will no
            longer be able to access it.
          </p>
          <Button variant='destructive' disabled={!!ownerOrgsNames?.length}>
            Delete account
          </Button>
        </div>
      </div>
    </div>
  );
}
