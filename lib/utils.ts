import { UserRole } from '@prisma/client/edge';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Org } from '@/data/org';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitProviderName(name?: string) {
  let firstname = '';
  let lastname = '';

  if (name) {
    const parts = name.trim().split(/\s+/);
    lastname = parts.pop() ?? '';
    firstname = parts.join(' ') ?? '';
  }

  return { firstname, lastname };
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function checkAdminRole(org: Org, userId?: string) {
  for (const user of org.users) {
    if (user.userId === userId) {
      return user.role === UserRole.ADMIN || user.role === UserRole.OWNER;
    }
  }
}

export function checkOwnerRole(org: Org, userId?: string) {
  for (const user of org.users) {
    if (user.userId === userId) {
      return user.role === UserRole.OWNER;
    }
  }
}
