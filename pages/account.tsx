import { AuthContainer } from '@aa/container';
import { AppConsumer, AppContext } from '@aa/context';
import { createUser, getUser } from '@aa/prisma/user';
import { getSession } from '@auth0/nextjs-auth0';
import { useUser } from '@auth0/nextjs-auth0/client';
import { IncomingMessage, ServerResponse } from 'http';
import Head from 'next/head';
import React, { useContext, useEffect } from 'react';

function renderAvatar(url: string, index: number) {
  return (
    <div key={`avatar-${index}`} className="flex flex-col gap-2 items-center">
      <img src={url} alt="" />
      <a className="text-green-600">Download Avatar</a>
    </div>
  );
}

function Spinner() {
  return <p>Loading...</p>;
}

function MyAvatars() {
  return (
    <AppConsumer>
      {(appContext) => (
        <div className="py-5">
          {appContext.state.avatars.map(renderAvatar)}
          {appContext.state.avatars.length === 0 && <p>You have no avatars</p>}
        </div>
      )}
    </AppConsumer>
  );
}

function UserCredits() {
  return (
    <AppConsumer>
      {(appContext) => (
        <p className="font-medium">Credits: {appContext.state.credits}</p>
      )}
    </AppConsumer>
  );
}

function UserProfile() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (!user) return null;

  return (
    <div className="flex gap-3 items-center border-b-2 py-2">
      <UserCredits />
      <p className="font-medium">{user.email}</p>
    </div>
  );
}

function AddCreditsButton() {
  return (
    <a
      href=""
      className="bg-green-800 px-3 py-2 rounded text-white hover:bg-green-700"
    >
      Add credits
    </a>
  );
}

function GenerateAvatarsButton() {
  const appContext = useContext(AppContext);

  const generateAvatars = async () => {
    const res = await fetch('/api/avatar/generate-avatar').then((res) =>
      res.json(),
    );

    if (Array.isArray(res.urls)) {
      appContext.dispatch({ type: 'add:avatars', avatars: res.urls });
      appContext.dispatch({ type: 'reduce:credits', by: res.urls.length });
    }
  };

  return (
    <AppConsumer>
      {(appContext) => (
        <button
          disabled={appContext.state.credits === 0}
          className="bg-sky-800 px-3 py-2 rounded text-white hover:bg-sky-700 disabled:opacity-20 disabled:pointer-events-none"
          onClick={generateAvatars}
        >
          Generate Avatars
        </button>
      )}
    </AppConsumer>
  );
}

function LogoutButton() {
  return (
    <a
      className="bg-red-800 px-3 py-2 rounded text-white hover:bg-red-700"
      href="/api/auth/logout"
    >
      Logout
    </a>
  );
}

function Account(props: { credits: number }) {
  const { credits } = props;

  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    dispatch({ type: 'set:credits', credits });
  }, [credits, dispatch]);

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}

export default Account;

export async function getServerSideProps(ctx: {
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
}) {
  const session = await getSession(ctx.req, ctx.res);

  if (!session?.user.email) {
    return { props: {} };
  }

  let credits = 0;

  const user = await getUser(session.user.email);

  if (user === null) {
    await createUser(session.user.email);
  } else {
    credits = user.credits;
  }

  return { props: { credits } };
}
