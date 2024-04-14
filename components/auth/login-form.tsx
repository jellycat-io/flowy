'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { login } from '@/actions/login';
import { CardWrapper } from '@/components/auth/card-wrapper';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Routes } from '@/routes';
import { LoginSchema } from '@/schemas';

export function LoginForm() {
  const [error, setError] = React.useState<string | undefined>('');
  const [success, setSuccess] = React.useState<string | undefined>('');
  const [showTwoFactor, setShowTwoFactor] = React.useState<boolean>(false);
  const [isPending, startTransition] = React.useTransition();

  const searchParams = useSearchParams();
  const urlError: string =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with another provider'
      : '';
  const callbackUrl = searchParams.get('callbackUrl');

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit, control } = form;

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('');
    setSuccess('');

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => setError('Something went wrong.'));
    });
  };

  return (
    <CardWrapper
      headerLabel='Welcome back'
      backButtonLabel="Don't have an account?"
      backButtonHref={Routes.auth.register}
      showSocials={!showTwoFactor}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            {!showTwoFactor && (
              <>
                <FormField
                  control={control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='johndoe@example.com'
                          autoFocus
                          autoComplete='email'
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type='password'
                          placeholder='********'
                          autoComplete='current-password'
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                      <Button
                        variant='link'
                        className='p-0 font-normal'
                        asChild
                      >
                        <Link href={Routes.auth.forgotPassword}>
                          Forgot password?
                        </Link>
                      </Button>
                    </FormItem>
                  )}
                />
              </>
            )}
            {showTwoFactor && (
              <FormField
                control={control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two-factor code</FormLabel>
                    <FormControl>
                      <InputOTP
                        {...field}
                        maxLength={6}
                        autoFocus
                        autoComplete='one-time-code'
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <FormError message={error ?? urlError} />
          <FormSuccess message={success} />
          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending && (
              <LoaderCircle className='mr-2 w-4 h-4 animate-spin' />
            )}
            {showTwoFactor ? 'Verify code' : 'Login'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
