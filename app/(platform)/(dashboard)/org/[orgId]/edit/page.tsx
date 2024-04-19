'use client';

import { useSession } from 'next-auth/react';

import { getOrg } from '@/actions/org/get-org';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { useFetch } from '@/hooks/use-fetch';

export default function EditOrgPage({
  params,
}: {
  params: {
    orgId: string;
  };
}) {
  const session = useSession();

  const { data: org, loading: loadingOrg } = useFetch(getOrg, {
    orgId: params.orgId,
  });

  if (loadingOrg) {
    return <Skeleton className='w-full h-[82px] m-4' />;
  }

  return (
    <div className='p-4 text-sm'>
      {org && (
        <div className='flex flex-col space-y-6'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/settings?tab=orgs'>
                  Organizations
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{org.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className='text-xl'>{org.name}</h1>
        </div>
      )}
    </div>
  );
}
