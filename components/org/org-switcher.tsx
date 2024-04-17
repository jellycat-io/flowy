'use client';

import { Building, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';
import { toast } from 'sonner';

import { getUserOrgs } from '@/actions/org/get-user-orgs';
import { setActiveOrg } from '@/actions/org/set-active-org';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAction } from '@/hooks/use-action';
import { useActiveOrg } from '@/hooks/use-active-org';
import { useFetch } from '@/hooks/use-fetch';

export function OrgSwitcher() {
  const session = useSession();
  const activeOrg = useActiveOrg();
  const router = useRouter();

  const { execute } = useAction(setActiveOrg, {
    onError: (error) => {
      toast.error(error);
    },
    onSuccess: async (org) => {
      toast.success(`Switched to ${org.name}`);
      await session.update();
      router.push(`/org/${org.id}`);
    },
  });

  const { data: orgs, loading: isLoadingOrgs } = useFetch(getUserOrgs);

  const onOrgChange = (orgId: string) => {
    execute({
      orgId,
    });
  };

  return (
    <Select defaultValue={activeOrg?.id} onValueChange={onOrgChange}>
      <SelectTrigger>
        <div className='flex gap-x-2 items-center'>
          <Building className='h-4 w-4' />
          {isLoadingOrgs ? (
            <LoaderCircle className='h-4 w-4 animate-spin text-muted-foreground' />
          ) : (
            <SelectValue />
          )}
        </div>
      </SelectTrigger>
      <SelectContent>
        {orgs?.map((org) => (
          <SelectItem key={org.id} value={org.id}>
            {org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
