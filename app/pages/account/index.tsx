import { AddCreditsForm } from '@aa/components/add-credits';
import { GenerateAvatarForm } from '@aa/components/generate-avatars';
import { closeIcon, openIcon } from '@aa/components/icons';
import { MyAvatars } from '@aa/components/my-avatars';
import { Nav } from '@aa/components/nav';
import { PageSnackbar } from '@aa/components/page-snackbar';
import { AuthContainer } from '@aa/containers/auth-container';
import {
  MainContainer,
  MainContainerContent,
  MainContainerLayout,
  MainContainerSidebar,
} from '@aa/containers/main-container';
import { AppProvider, useAppDispatch, useAppState } from '@aa/context';
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

function GenerateAvatarSidebar() {
  const appState = useAppState();
  const appDispatch = useAppDispatch();

  const closeGenerateAvatarSidebar = () =>
    appDispatch({ type: 'close:generate-avatar-sidebar' });

  return (
    <MainContainerSidebar
      className={[
        appState.addCreditsSidebarOpen ? 'border-r-l' : 'border-r-0',
        'left-0',
      ].join(' ')}
      isOpen={appState.generateAvatarSidebarOpen}
      onClose={closeGenerateAvatarSidebar}
      closeIcon={
        <div
          className="absolute top-4 right-8 cursor-pointer"
          onClick={closeGenerateAvatarSidebar}
        >
          {closeIcon}
        </div>
      }
    >
      <GenerateAvatarForm />
    </MainContainerSidebar>
  );
}

function AddCreditsSidebar() {
  const appState = useAppState();
  const appDispatch = useAppDispatch();

  const closeAddCreditsSidebar = () =>
    appDispatch({ type: 'close:add-credits-sidebar' });

  return (
    <MainContainerSidebar
      className={[
        appState.addCreditsSidebarOpen ? 'border-l-l' : 'border-l-0',
        'right-0',
      ].join(' ')}
      isOpen={appState.addCreditsSidebarOpen}
      onClose={closeAddCreditsSidebar}
      closeIcon={
        <div
          className="absolute top-3 left-5 cursor-pointer"
          onClick={closeAddCreditsSidebar}
        >
          {closeIcon}
        </div>
      }
    >
      <AddCreditsForm />
    </MainContainerSidebar>
  );
}

function SidebarActions() {
  const appState = useAppState();
  const appDispatch = useAppDispatch();

  const toggleAddCreditsSidebar = () =>
    appDispatch({ type: 'toggle:add-credits-sidebar' });

  const toggleGenerateAvatarSidebar = () =>
    appDispatch({ type: 'toggle:generate-avatar-sidebar' });

  return (
    <div className="w-full p-5 gap-5 flex flex-col items-start sm:flex-row sm:justify-between">
      <button
        className="btn btn-primary gap-2"
        onClick={toggleGenerateAvatarSidebar}
      >
        {appState.generateAvatarSidebarOpen ? closeIcon : openIcon}
        Generate Avatar
      </button>
      <button
        className="btn btn-secondary gap-2"
        onClick={toggleAddCreditsSidebar}
      >
        {appState.addCreditsSidebarOpen ? closeIcon : openIcon}
        Add Credits
      </button>
    </div>
  );
}

function AccountMainContent() {
  return (
    <MainContainerLayout>
      <GenerateAvatarSidebar />

      <MainContainerContent>
        <SidebarActions />

        <hr className="w-full" />

        <MyAvatars />
      </MainContainerContent>

      <AddCreditsSidebar />
    </MainContainerLayout>
  );
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

          <AccountMainContent />

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
  const session = await getSession(ctx.req, ctx.res);

  if (!session?.user.email) {
    return { props: { credits: 0, avatars: [] } };
  }

  const user = await getUser(session.user.email);

  if (user === null) {
    await createUser(session.user.email);
    return { props: { credits: 0, avatars: [] } };
  }

  const avatarDocuments = await getAvatars(session.user.email);

  if (!avatarDocuments) {
    return { props: { credits: user.credits, avatars: [] } };
  }

  const avatarModels = await Promise.all(
    avatarDocuments.map(prepareAvatarModel),
  );

  const avatars = avatarModels.filter(
    (avatarModel): avatarModel is AvatarModel => avatarModel !== null,
  );

  return { props: { credits: user.credits, avatars } };
}
