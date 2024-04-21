'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Building, LoaderCircle, Plus } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { createOrgAction } from '@/actions/org/create-org';
import { CreateOrgSchema } from '@/actions/org/schemas';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useOrgs } from '@/contexts/org-context';
import { useAction } from '@/hooks/use-action';

export function OrgSwitcher() {
  const { activeOrg, setActiveOrg, orgs, refreshOrgs, isLoading } = useOrgs();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);

  const form = useForm<z.infer<typeof CreateOrgSchema>>({
    resolver: zodResolver(CreateOrgSchema),
    defaultValues: {
      name: '',
      isActiveOrg: false,
    },
  });

  const { control, formState, handleSubmit, reset } = form;

  const { execute: createOrg, loading: isCreateLoading } = useAction(
    createOrgAction,
    {
      onError: (error) => {
        toast.error(error);
      },
      onSuccess: async ({ org, setAsActive }) => {
        toast.success(`${org.name} created successfully!`);
        setShowCreateDialog(false);

        await refreshOrgs();

        if (setAsActive) {
          setActiveOrg(org.id);
        }
      },
    },
  );

  const onOrgChange = (orgId: string) => {
    if (activeOrg?.id === orgId) return;

    setActiveOrg(orgId);
  };

  const onCreateOrg = (values: z.infer<typeof CreateOrgSchema>) => {
    createOrg(values);
  };

  return (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size='sm' variant='outline'>
            <Building className='mr-2 h-4 w-4' />
            {isLoading ? (
              <LoaderCircle className='h-4 w-4 animate-spin text-muted-foreground' />
            ) : (
              <span className='shrink-0 text-ellipsis overflow-hidden w-24'>
                {orgs?.find((org) => org.id === activeOrg?.id)?.name}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {orgs?.map((org) => (
            <DropdownMenuCheckboxItem
              key={org.id}
              checked={org.id === activeOrg?.id}
              onCheckedChange={(checked) => !!checked && onOrgChange(org.id)}
            >
              <span>{org.name}</span>
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />

          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Plus className='mr-2 w-4 h-4' />
              <span>Create organization</span>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onCreateOrg)} className='space-y-6'>
            <FormField
              name='name'
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isCreateLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='isActiveOrg'
              control={control}
              render={({ field }) => (
                <FormItem className='flex items-center space-x-2 space-y-0'>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isCreateLoading}
                    />
                  </FormControl>
                  <FormLabel>Set as active organization?</FormLabel>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                variant='ghost'
                disabled={!formState.isDirty || isCreateLoading}
                onClick={() => {
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={!formState.isDirty || isCreateLoading}
              >
                {isCreateLoading && (
                  <LoaderCircle className='h-4 w-4 animate-spin' />
                )}
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
