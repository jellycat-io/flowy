'use client';

import { LoaderCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React from 'react';

import { emailVerification } from '@/actions/auth/email-verification';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Routes } from '@/routes';

export const EmailVerificationForm = () => {
  const [error, setError] = React.useState<string | undefined>('');
  const [success, setSuccess] = React.useState<string | undefined>('');

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = React.useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError('Missing token.');
      return;
    }

    emailVerification(token)
      .then((data) => {
        setError(data.error);
        setSuccess(data.success);
      })
      .catch(() => setError('Something went wrong.'));
  }, [token, success, error]);

  React.useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel='Confirm your email address'
      backButtonLabel='Back to login'
      backButtonHref={Routes.auth.login}
    >
      <div className='flex items-center w-full justify-center'>
        {!success && !error && (
          <LoaderCircle className='text-xl animate-spin' />
        )}
        {!success && <FormError message={error} />}
        <FormSuccess message={success} />
      </div>
    </CardWrapper>
  );
};
