import { AccountMainContent } from '@aa/components/account-main-content';
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
import Head from 'next/head';
import Script from 'next/script';
import React from 'react';

export default function Account(props: AccountProps) {
  const { avatars, credits } = props;

  return (
    <ApiProvider avatars={avatars} credits={credits}>
      <AppProvider>
        <Head>
          <title>AI Portrait Studio | Account</title>
          <meta
            name="description"
            content="Get instant, custom portraits at AI Portrait Studio. Our AI technology generates unique images based on your photos. Create a personalized work of art in minutes."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="keywords"
            content="AI technology, Portraits, Custom, Images, Personalized, Photos, Art, Instant, Generates, Unique, Memories, Work of art, Advanced technology, Skilled artists"
          />
          <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DMYWSZ00P0"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-DMYWSZ00P0');
        `}
        </Script>

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
