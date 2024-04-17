'use client';

import { UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React from 'react';

import { GetOrgInput, GetOrgResponse, getOrg } from '@/actions/org/get-org';
import { RoleGate } from '@/components/auth/role-gate';
import { OrgSwitcher } from '@/components/org/org-switcher';
import { UserButton } from '@/components/user-button';
import { useFetch } from '@/hooks/use-fetch';
import { Org } from '@/next-auth';

export default function DashboardPage({
  params,
}: {
  params: { orgId: string };
}) {
  const session = useSession();

  const { data: org } = useFetch(getOrg, {
    orgId: params.orgId,
  });

  return (
    <div className='p-4'>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard!</p>
      <RoleGate allowedRoles={[UserRole.ADMIN, UserRole.OWNER]}>
        <pre className='rounded-md bg-slate-950 p-4 h-40 overflow-y-scroll'>
          <code className='text-white'>{JSON.stringify(session, null, 2)}</code>
        </pre>
      </RoleGate>
      <p>{org?.name}</p>
      <p>Premium: {org?.premium ? 'true' : 'false'}</p>
      <UserButton />
      <OrgSwitcher />
    </div>
  );
}