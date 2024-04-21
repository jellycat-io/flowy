'use client';

import { ChevronLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react';
import { toast } from 'sonner';

import { deleteOrgAction } from '@/actions/org/delete-org';
import { getOrg } from '@/actions/org/get-org';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { useOrgs } from '@/contexts/org-context';
import { useAction } from '@/hooks/use-action';

import { MembersManager } from './_components/members-manager';
import { OrgInfoForm } from './_components/org-info-form';

export default function EditOrgPage({
  params,
}: {
  params: {
    orgId: string;
  };
}) {
  const session = useSession();
  const { orgs, refreshOrgs, isLoading } = useOrgs();

  if (!session.data?.user.id) {
    throw new Error('Unauthorized');
  }

  const org = orgs.find((org) => org.id === params.orgId);

  return (
    <div className='p-4 text-sm'>
      {org && (
        <div className='flex flex-col space-y-6'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href='/settings?tab=orgs'
                  className='flex items-center'
                >
                  <ChevronLeft className='mr-2 w-4 h-4' />
                  Back to organizations
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <OrgInfoForm
            org={org}
            isLoading={isLoading}
            onSuccess={() => {
              refreshOrgs();
              session.update();
            }}
          />
          <MembersManager orgId={params.orgId} />
        </div>
      )}
    </div>
  );
}
