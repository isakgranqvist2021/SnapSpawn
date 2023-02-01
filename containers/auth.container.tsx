import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import React, { PropsWithChildren } from 'react';

import { LoadingContainer } from './loading.container';

export function AuthContainer(props: PropsWithChildren) {
  const { children } = props;

  const { user, error, isLoading } = useUser();

  const router = useRouter();

  if (isLoading) {
    return <LoadingContainer />;
  }

  if (error) {
    router.replace('/error');
    return <LoadingContainer />;
  }

  if (!user) {
    router.replace('/api/auth/login');
    return <LoadingContainer />;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
