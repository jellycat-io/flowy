import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
