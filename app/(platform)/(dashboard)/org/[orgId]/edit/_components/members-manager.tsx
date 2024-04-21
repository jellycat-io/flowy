'use client';

import { UserPlus } from 'lucide-react';

import { getOrgUsers } from '@/actions/org/get-org-users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetch } from '@/hooks/use-fetch';
import { capitalize } from '@/lib/utils';

interface MembersManagerProps {
  orgId: string;
}

export function MembersManager({ orgId }: MembersManagerProps) {
  const { data: orgUsers, loading: loadingOrgUsers } = useFetch(getOrgUsers, {
    orgId: orgId,
  });

  return (
    <div className='flex flex-col space-y-2'>
      {loadingOrgUsers ? (
        <>
          <Skeleton className='w-full h-[28px]' />
          <Skeleton className='w-full h-[166px]' />
        </>
      ) : (
        <>
          <h2 className='text-lg'>Members</h2>
          <div className='border rounded-sm p-4'>
            {orgUsers &&
              orgUsers.map((user) => (
                <div
                  key={user.id}
                  className='flex justify-between items-center'
                >
                  <div className='flex items-center space-x-2'>
                    <Avatar>
                      <AvatarImage
                        src={user.image ?? undefined}
                        alt={user.name}
                      />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{user.name}</p>
                      <p className='text-xs text-gray-500'>{user.email}</p>
                    </div>
                  </div>
                  <Badge>
                    <span>{capitalize(user.role)}</span>
                  </Badge>
                </div>
              ))}
          </div>
          <div className='flex justify-center items-center'>
            <Button variant='secondary' size='sm'>
              <UserPlus className='mr-2 w-4 h-4' />
              Invite members
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
