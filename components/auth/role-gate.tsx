'use client';

import { UserRole } from '@prisma/client';

import { FormError } from '@/components/form-error';
import { useActiveUser } from '@/hooks/use-active-user';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  showUnauthorized?: boolean;
}

export function RoleGate({
  children,
  allowedRoles,
  showUnauthorized = false,
}: RoleGateProps) {
  const user = useActiveUser();

  if (!user) {
    return showUnauthorized ? (
      <FormError message='You must be logged in to view this content!' />
    ) : null;
  }

  if (!allowedRoles.includes(user.role)) {
    return showUnauthorized ? (
      <FormError message='You do not have permission to view this content!' />
    ) : null;
  }

  return <>{children}</>;
}
