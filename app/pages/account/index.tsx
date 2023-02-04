import { MyAvatars } from '@aa/components/my-avatars';
import { Nav } from '@aa/components/nav';
import { PageSnackbar } from '@aa/components/page-snackbar';
import { WelcomeMessage } from '@aa/components/welcome-message';
import { AuthContainer, MainContainer } from '@aa/containers';
import { AppProvider } from '@aa/context';
import { AvatarDocument, getAvatars } from '@aa/database/avatar';
import { createUser, getUser } from '@aa/database/user';
import { AvatarModel } from '@aa/models';
import { getSignedUrl } from '@aa/services/gcp';
import { Logger } from '@aa/services/logger';
import { getSession } from '@auth0/nextjs-auth0';
import { IncomingMessage, ServerResponse } from 'http';
import Head from 'next/head';
import React from 'react';

interface AccountProps {
  avatars: AvatarModel[];
  credits: number;
}

interface GetServerSideProps {
  props: AccountProps;
}

interface GetServerSidePropsContext {
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
}

export default function Account(props: AccountProps) {
  const { avatars, credits } = props;

  return (
    <AppProvider avatars={avatars} credits={credits}>
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

      <AuthContainer>
        <MainContainer>
          <Nav />

          <WelcomeMessage />

          <MyAvatars />

          <PageSnackbar />
        </MainContainer>
      </AuthContainer>
    </AppProvider>
  );
}

async function prepareAvatarModel(
  avatarDocument: AvatarDocument,
): Promise<AvatarModel | null> {
  try {
    const { _id, avatar, createdAt, prompt } = avatarDocument;

    const url = await getSignedUrl(avatar);

    return {
      createdAt: new Date(createdAt).getTime(),
      id: _id.toHexString(),
      prompt,
      url,
    };
  } catch {
    return null;
  }
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext,
): Promise<GetServerSideProps> {
  try {
    const session = await getSession(ctx.req, ctx.res);

    if (!session?.user.email) {
      throw new Error('Session is null');
    }

    const user = await getUser(session.user.email);

    if (user === null) {
      await createUser(session.user.email);
      return { props: { credits: 0, avatars: [] } };
    }

    const avatarDocuments = await getAvatars(session.user.email);

    if (!avatarDocuments) {
      throw new Error('Avatar documents not found');
    }

    const avatarModels = await Promise.all(
      avatarDocuments.map(prepareAvatarModel),
    );

    const avatars = avatarModels.filter(
      (avatarModel): avatarModel is AvatarModel => avatarModel !== null,
    );

    return { props: { credits: user.credits, avatars } };
  } catch (err) {
    Logger.log('error', err);
    return { props: { credits: 0, avatars: [] } };
  }
}
