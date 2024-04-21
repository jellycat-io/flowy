import { UserRole } from '@prisma/client';
import { DoorOpen, Pencil, Sparkles, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { toast } from 'sonner';

import { deleteOrgAction } from '@/actions/org/delete-org';
import { getUserOrgs } from '@/actions/org/get-user-orgs';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrgs } from '@/contexts/org-context';
import { Org } from '@/data/org';
import { useAction } from '@/hooks/use-action';
import { useFetch } from '@/hooks/use-fetch';
import { ExtendedUser } from '@/next-auth';

interface OrgsManagerProps {
  user: ExtendedUser;
}

function checkAdminRole(org: Org, userId?: string) {
  for (const user of org.users) {
    if (user.userId === userId) {
      return user.role === UserRole.ADMIN || user.role === UserRole.OWNER;
    }
  }
}

function checkOwnerRole(org: Org, userId?: string) {
  for (const user of org.users) {
    if (user.userId === userId) {
      return user.role === UserRole.OWNER;
    }
  }
}

export function OrgsManager({ user }: OrgsManagerProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const { orgs, isLoading, refreshOrgs } = useOrgs();

  const { execute: deleteOrg, loading: deletingOrg } = useAction(
    deleteOrgAction,
    {
      onError: (error) => {
        toast.error(error);
      },
      onSuccess: async (data) => {
        toast.success(data.success);
        refreshOrgs();
      },
    },
  );

  const onDeleteOrg = (orgId: string) => {
    deleteOrg({
      userId: user.id!,
      orgId,
    });
  };

  return (
    <>
      {isLoading ? (
        <Skeleton className='w-full h-[82px]' />
      ) : (
        <div className='flex flex-col space-y-4 text-sm'>
          {orgs?.map((org) => (
            <div
              key={org.id}
              className='flex items-center justify-between border p-4 rounded-sm'
            >
              <div className='flex flex-col space-y-2'>
                <div className='flex space-x-2'>
                  <h3>{org.name}</h3>
                  {org.premium && (
                    <Badge>
                      <Sparkles className='mr-1 w-4 h-4' />
                      Premium
                    </Badge>
                  )}
                </div>
                <p>{`${org.users.length} ${org.users.length === 1 ? 'user' : 'users'}`}</p>
              </div>
              <div className='flex items-center justify-end space-x-2'>
                {checkAdminRole(org, user?.id) && (
                  <Button size='sm' className='w-24' asChild>
                    <Link href={`/org/${org.id}/edit`}>
                      <Pencil className='mr-2 w-4 h-4' />
                      Manage
                    </Link>
                  </Button>
                )}
                {checkOwnerRole(org, user?.id) ? (
                  <ConfirmDialog
                    title='Delete organization'
                    content='Are you sure you want to delete this organization?'
                    isLoading={deletingOrg}
                    isOpen={showDeleteConfirm}
                    onOpenChange={setShowDeleteConfirm}
                    onConfirm={() => onDeleteOrg(org.id)}
                  >
                    <Button size='sm' variant='destructive'>
                      <Trash2 className='mr-2 w-4 h-4' />
                      Delete
                    </Button>
                  </ConfirmDialog>
                ) : (
                  <Button size='sm' variant='destructive' disabled>
                    <DoorOpen className='mr-2 w-4 h-4' />
                    Leave
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

const isAdmin = (role: string) => role === 'ADMIN' || role === 'OWNER';
