import { DoorOpen, Pencil, Sparkles, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { getUserOrgs } from '@/actions/org/get-user-orgs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetch } from '@/hooks/use-fetch';
import { ExtendedUser } from '@/next-auth';

interface OrgsManagerProps {
  user: ExtendedUser;
}

export function OrgsManager({ user }: OrgsManagerProps) {
  const { data: orgs, loading: loadingOrgs } = useFetch(getUserOrgs, {
    userId: user.id!,
  });

  return (
    <>
      {loadingOrgs ? (
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
                  <Badge variant='outline'>
                    {`${org.role.charAt(0)}${org.role.slice(1).toLowerCase()}`}
                  </Badge>
                  {org.premium && (
                    <Badge>
                      <Sparkles className='mr-1 w-4 h-4' />
                      Premium
                    </Badge>
                  )}
                </div>
                <p>{`${org.nUsers} ${org.nUsers === 1 ? 'user' : 'users'}`}</p>
              </div>
              <div className='flex items-center justify-end space-x-2'>
                {isAdmin(org.role) && (
                  <Button size='sm' className='w-24' asChild>
                    <Link href={`/org/${org.id}/edit`}>
                      <Pencil className='mr-2 w-4 h-4' />
                      Manage
                    </Link>
                  </Button>
                )}
                <Button variant='destructive' size='sm' className='w-24'>
                  {org.role === 'OWNER' ? (
                    <Trash2 className='mr-2 h-4 w-4' />
                  ) : (
                    <DoorOpen className='mr-2 h-4 w-4' />
                  )}
                  {org.role === 'OWNER' ? 'Delete' : 'Leave'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

const isAdmin = (role: string) => role === 'ADMIN' || role === 'OWNER';
