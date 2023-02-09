import { AccountMainContent } from '@aa/components/account-main-content';
import { DefaultHead } from '@aa/components/default-head';
import { Nav } from '@aa/components/nav';
import { PageSnackbar } from '@aa/components/page-snackbar';
import { MainContainer } from '@aa/containers/main-container';
import { ApiProvider } from '@aa/context/api-context';
import { AppProvider } from '@aa/context/app-context';
import { getAvatars } from '@aa/database/avatar';
import { createUser, getUser } from '@aa/database/user';
import { AvatarModel } from '@aa/models';
import { Logger } from '@aa/services/logger';
import { AccountProps, GetServerSideProps } from '@aa/types';
import { prepareAvatarModel } from '@aa/utils';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import React from 'react';

export default function Account(props: AccountProps) {
  const { avatars, credits } = props;

  return (
    <ApiProvider avatars={avatars} credits={credits}>
      <AppProvider>
        <DefaultHead title="Account" />

        <MainContainer>
          <Nav />

          <AccountMainContent />

          <PageSnackbar />
        </MainContainer>
      </AppProvider>
    </ApiProvider>
  );
}

export const getServerSideProps = withPageAuthRequired({
  returnTo: '/account',
  getServerSideProps: async (ctx): Promise<GetServerSideProps> => {
    const session = await getSession(ctx.req, ctx.res);

    if (!session?.user.email) {
      Logger.log('warning', session);
      return { props: { credits: 0, avatars: [] } };
    }

    const user = await getUser(session.user.email);

    if (user === null) {
      await createUser(session.user.email);
      return { props: { credits: 0, avatars: [] } };
    }

    const avatarDocuments = await getAvatars(session.user.email);

    if (!avatarDocuments) {
      Logger.log('warning', avatarDocuments);
      return { props: { credits: user.credits, avatars: [] } };
    }

    const avatarModels = await Promise.all(
      avatarDocuments.map(prepareAvatarModel),
    );

    const avatars = avatarModels.filter(
      (avatarModel): avatarModel is AvatarModel => avatarModel !== null,
    );

    return { props: { credits: user.credits, avatars } };
  },
});
