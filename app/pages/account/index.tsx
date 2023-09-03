import { GenerateAvatarsForm } from '@aa/components/generate-avatars';
import { MyAvatars } from '@aa/components/my-avatars';
import {
  AuthPageContainer,
  DefaultProps,
} from '@aa/containers/auth-page-container';
import { ContentSidebarProvider } from '@aa/context';
import { loadServerSideProps } from '@aa/utils';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import React from 'react';

export default function Account(props: DefaultProps) {
  return (
    <AuthPageContainer title="Account" {...props}>
      <ContentSidebarProvider>
        <MyAvatars />

        <GenerateAvatarsForm />
      </ContentSidebarProvider>
    </AuthPageContainer>
  );
}

export const getServerSideProps = withPageAuthRequired({
  returnTo: '/account',
  getServerSideProps: loadServerSideProps,
});
