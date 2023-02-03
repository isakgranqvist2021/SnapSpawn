import { MyAvatars } from '@aa/components/my-avatars';
import { Nav } from '@aa/components/nav';
import { AuthContainer, MainContainer } from '@aa/containers';
import { UserContainer } from '@aa/containers/user.container';
import { AppProvider } from '@aa/context';
import { getAvatars } from '@aa/prisma/avatar';
import { createUser, getUser } from '@aa/prisma/user';
import { getSession } from '@auth0/nextjs-auth0';
import { IncomingMessage, ServerResponse } from 'http';
import Head from 'next/head';
import React from 'react';

export default function Account(props: { credits: number; avatars: string[] }) {
  const { avatars, credits } = props;

  return (
    <UserContainer>
      <AppProvider avatars={avatars} credits={credits}>
        <Head>
          <title>Ai Avatar | Account</title>
          <meta name="description" content="Ai avatar generator" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <AuthContainer>
          <MainContainer>
            <Nav />

            <MyAvatars />
          </MainContainer>
        </AuthContainer>
      </AppProvider>
    </UserContainer>
  );
}

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
}) {
  const session = await getSession(ctx.req, ctx.res);

  if (!session?.user.email) {
    return { props: {} };
  }

  let credits = 0;
  let avatars: string[] = [];

  const user = await getUser(session.user.email);

  if (user === null) {
    await createUser(session.user.email);
  } else {
    credits = user.credits;
    avatars = (await getAvatars(session.user.email)) ?? [];
  }

  return { props: { credits, avatars } };
}
