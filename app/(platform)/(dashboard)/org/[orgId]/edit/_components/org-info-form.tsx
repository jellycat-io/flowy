'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { UpdateOrgInfoSchema } from '@/actions/org/schemas';
import { updateOrgInfoAction } from '@/actions/org/update-org-info';
import { FormCancel } from '@/components/form-cancel';
import { FormSubmit } from '@/components/form-submit';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Org } from '@/data/org';
import { useAction } from '@/hooks/use-action';

interface OrgInfoFormProps {
  org?: Org;
  isLoading: boolean;
  onSuccess: () => void;
}

export function OrgInfoForm({ org, isLoading, onSuccess }: OrgInfoFormProps) {
  const form = useForm<z.infer<typeof UpdateOrgInfoSchema>>({
    resolver: zodResolver(UpdateOrgInfoSchema),
    defaultValues: {
      orgId: org?.id,
      name: org?.name ?? '',
    },
  });

  const { control, handleSubmit, reset } = form;

  React.useEffect(() => {
    if (org) {
      reset({
        orgId: org.id,
        name: org.name,
      });
    }
  }, [org, reset]);

  const { execute: updateOrgInfo, loading: updatingOrgInfo } = useAction(
    updateOrgInfoAction,
    {
      onSuccess: () => {
        toast.success('Organization updated');
        onSuccess();
      },
      onError: (error) => {
        toast.error(error);
      },
    },
  );

  function onSubmit(values: z.infer<typeof UpdateOrgInfoSchema>) {
    updateOrgInfo(values);
  }

  return (
    <div className='flex flex-col space-y-2'>
      {isLoading ? (
        <>
          <Skeleton className='w-full h-[28px]' />
          <Skeleton className='w-full h-[166px]' />
        </>
      ) : (
        <>
          <h2 className='text-lg'>Info</h2>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col space-y-6 p-4 border rounded-sm'
            >
              <FormField
                name='name'
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={updatingOrgInfo} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex space-x-2 justify-end'>
                <FormCancel isLoading={updatingOrgInfo} />
                <FormSubmit isLoading={updatingOrgInfo} />
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}
