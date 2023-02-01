import { AuthContainer } from '@aa/container';
import { AppProvider } from '@aa/context';
import {
  AddCreditsButton,
  GenerateAvatarsButton,
  LogoutButton,
  MyAvatars,
  UserProfile,
} from '@aa/page-components/account';
import { getAvatars } from '@aa/prisma/avatar';
import { createUser, getUser } from '@aa/prisma/user';
import { getSession } from '@auth0/nextjs-auth0';
import { IncomingMessage, ServerResponse } from 'http';
import Head from 'next/head';
import React from 'react';

export default function Account(props: { credits: number; avatars: string[] }) {
  const { avatars, credits } = props;

  return (
    <AppProvider avatars={avatars} credits={credits}>
      <Head>
        <title>Ai Avatar | Account</title>
        <meta name="description" content="Ai avatar generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthContainer>
        <main className="bg-slate-800 h-screen overflow-hidden">
          <div className="container mx-auto bg-white h-screen overflow-auto flex flex-col items-center p-5">
            <UserProfile />

            <div className="flex gap-3 border-b-2 py-5">
              <AddCreditsButton />
              <GenerateAvatarsButton />
              <LogoutButton />
            </div>

            <MyAvatars />
          </div>
        </main>
      </AuthContainer>
    </AppProvider>
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
    const avatarsResponse = await getAvatars(session.user.email);

    if (avatarsResponse) {
      avatars = avatarsResponse.map(({ avatar }) => avatar);
    }
  }

  return { props: { credits, avatars } };
}
