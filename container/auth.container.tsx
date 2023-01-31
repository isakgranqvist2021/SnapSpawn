import { Spinner } from '@aa/components/spinner';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import { NextResponse } from 'next/server';
import React, { PropsWithChildren } from 'react';

export function AuthContainer(props: PropsWithChildren) {
  const { children } = props;

  const { user, error, isLoading } = useUser();

  const router = useRouter();

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    router.replace('/error');
    return <Spinner />;
  }

  if (!user) {
    router.replace('/api/auth/login');
    return <Spinner />;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
