import { UserProvider } from '@auth0/nextjs-auth0/client';
import { PropsWithChildren } from 'react';

export function UserContainer(props: PropsWithChildren) {
  const { children } = props;

  return <UserProvider>{children}</UserProvider>;
}
