import { GenerateAvatarsForm } from '@aa/components/generate-avatars';
import { MyAvatars } from '@aa/components/my-avatars';
import {
  AuthPageContainer,
  DefaultProps,
} from '@aa/containers/auth-page-container';
import { loadServerSideProps } from '@aa/utils';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import React from 'react';

export default function Account(props: DefaultProps) {
  return (
    <AuthPageContainer title="Account" {...props}>
      <GenerateAvatarsForm />

      <MyAvatars />
    </AuthPageContainer>
  );
}

export const getServerSideProps = withPageAuthRequired({
  returnTo: '/account',
  getServerSideProps: loadServerSideProps,
});
