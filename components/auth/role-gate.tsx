'use client';

import { UserRole } from '@prisma/client';

import { FormError } from '@/components/form-error';
import { useCurrentRole } from '@/hooks/use-active-role';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export function RoleGate({ children, allowedRole }: RoleGateProps) {
  const role = useCurrentRole();

  if (role !== allowedRole) {
    return (
      <FormError message='You do not have permission to view this page!' />
    );
  }

  return <>{children}</>;
}
