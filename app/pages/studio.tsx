import { EmptyState } from '@aa/components/empty-state';
import { GenerateImageForm } from '@aa/components/generate-image-form';
import { AddCreditsDrawerContext } from '@aa/components/nav';
import { Spinner } from '@aa/components/spinner';
import {
  AuthPageContainer,
  DefaultProps,
} from '@aa/containers/auth-page-container';
import { AppContext, AppProvider } from '@aa/context';
import { completeReferral } from '@aa/database/referral';
import { AvatarModel } from '@aa/models/avatar';
import { loadServerSideProps } from '@aa/utils';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';
import dayjs from 'dayjs';
import { GetServerSidePropsContext } from 'next';
import React from 'react';

function constructTreeAsList(avatars: AvatarModel[]): AvatarModel[] {
  const flatTree: AvatarModel[] = [];

  const addToFlatTree = (avatar: AvatarModel) => {
    flatTree.push(avatar);

    avatars
      .filter((child) => child.parentId === avatar.id)
      .forEach((child) => addToFlatTree(child));
  };

  avatars.forEach((avatar) => {
    if (avatar.parentId === null) {
      addToFlatTree(avatar);
    }
  });

  return flatTree;
}

function AvatarCard(props: AvatarModel) {
  const { id, urls, createdAt, prompt } = props;

  const appContext = React.useContext(AppContext);

  const generateVariant = async () => {
    window.scrollTo(0, 0);

    try {
      appContext.dispatch({ type: 'avatars:set-is-loading', isLoading: true });

      const res = await fetch('/api/create-variant', {
        body: JSON.stringify({ id }),
        method: 'POST',
      });

      if (res.status !== 200) {
        throw new Error('Invalid response');
      }

      const data: { avatars: AvatarModel[] } | undefined = await res.json();

      if (!data || !Array.isArray(data.avatars)) {
        throw new Error('Invalid response');
      }

      appContext.dispatch({ type: 'avatars:add', avatars: data.avatars });
      appContext.dispatch({
        type: 'credits:reduce',
        reduceCreditsBy: data.avatars.length,
      });
      appContext.dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'success',
          message: 'Variant generated successfully!',
        },
      });
      appContext.dispatch({ type: 'avatars:set-is-loading', isLoading: false });

      return data.avatars;
    } catch {
      appContext.dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'error',
          message: 'Something went wrong. Please try again later.',
        },
      });
      appContext.dispatch({ type: 'avatars:set-is-loading', isLoading: false });

      return null;
    }
  };

  const renderDownloadLink = (key: string) => {
    return (
      <li>
        <a
          className="link link-secondary"
          download
          href={urls[key as keyof typeof urls]}
          key={key}
          rel="noreferrer"
          target="_blank"
        >
          {key}
        </a>
      </li>
    );
  };

  return (
    <React.Fragment>
      <input type="checkbox" id={id} className="modal-toggle" />
      <label htmlFor={id} className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <p className="content-base-300 text-center mb-2">
            {dayjs(createdAt).format('YYYY-MM-DD HH:mm')}
          </p>

          <img
            className="object-fit"
            alt="Ai generated avatar"
            loading="lazy"
            src={urls['1024x1024']}
          />

          {prompt && (
            <div className="max-w-prose text-center flex flex-col gap-2 p-4">
              <p className="content-base-200">{prompt}</p>
            </div>
          )}

          <div className="flex flex-col gap-5">
            <div className="flex items-center md:justify-center pt-4 gap-2 md:flex-row flex-col">
              <div className="dropdown dropdown-top w-full md:w-auto">
                <label tabIndex={0} className="btn gap-2 w-full md:w-auto">
                  Download
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full md:w-52 mb-1"
                >
                  {Object.keys(urls)
                    .sort((a, b) => {
                      const aSize = parseInt(a.split('x')[0]);
                      const bSize = parseInt(b.split('x')[0]);

                      return bSize - aSize;
                    })
                    .map(renderDownloadLink)}
                </ul>
              </div>

              <button
                className="btn btn-primary relative w-full md:w-auto"
                disabled={
                  !appContext.state.credits.data ||
                  appContext.state.avatars.isLoading
                }
                onClick={generateVariant}
              >
                {appContext.state.avatars.isLoading && (
                  <div className="absolute z-10">
                    <Spinner />
                  </div>
                )}

                <span
                  className={
                    appContext.state.avatars.isLoading ? 'opacity-0' : ''
                  }
                >
                  {!appContext.state.credits.data
                    ? 'You have no credits'
                    : 'Generate variant'}
                </span>
              </button>
            </div>
          </div>
        </label>
      </label>

      <label htmlFor={id}>
        <div
          style={{
            display: 'block',
            backgroundImage: `url(${urls['128x128']})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minWidth: 128,
            minHeight: 128,
          }}
          className="cursor-pointer ease-in-out transition-all duration-200"
        />
      </label>
    </React.Fragment>
  );
}

function renderAvatar(avatar: AvatarModel) {
  return <AvatarCard {...avatar} key={avatar.id} />;
}

function ZeroCoinsEmptyState() {
  const creditsDrawerContext = React.useContext(AddCreditsDrawerContext);
  const appContext = React.useContext(AppContext);

  if (!appContext.state.credits.data) {
    return (
      <div className="w-full p-5">
        <EmptyState
          buttonOnClick={() => creditsDrawerContext.openDrawer()}
          buttonText="Add credits"
          message="No credits. Add credits to generate pictures."
        />
      </div>
    );
  }

  return null;
}

function Avatars() {
  const appContext = React.useContext(AppContext);

  const flatTree = React.useMemo(
    () => constructTreeAsList(appContext.state.avatars.data),
    [appContext.state.avatars.data],
  );

  return (
    <div
      className="w-full px-5 pt-5"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(128px, 1fr))',
      }}
    >
      {flatTree.reverse().map(renderAvatar)}
    </div>
  );
}

export default function Studio(props: DefaultProps) {
  return (
    <AppProvider {...props}>
      <AuthPageContainer title="Studio" {...props}>
        <div className="w-full flex flex-col justify-between flex-grow">
          <div className="w-full">
            <Avatars />

            <ZeroCoinsEmptyState />
          </div>

          <GenerateImageForm />
        </div>
      </AuthPageContainer>
    </AppProvider>
  );
}

export const getServerSideProps = withPageAuthRequired({
  returnTo: '/studio',
  getServerSideProps: async (ctx: GetServerSidePropsContext) => {
    if (typeof ctx.query.referral === 'string') {
      const session = await getSession(ctx.req, ctx.res);
      if (!session?.user.email) {
        return loadServerSideProps(ctx);
      }

      await completeReferral({
        referral: ctx.query.referral,
        toEmail: session.user.email,
      });
    }

    return loadServerSideProps(ctx);
  },
});
