import { EmptyState } from '@aa/components/empty-state';
import { GenerateImageForm } from '@aa/components/forms';
import {
  AddCreditsDrawerContext,
  GeneratePictureDrawerContext,
} from '@aa/components/nav';
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
    );
  };

  return (
    <React.Fragment>
      <input type="checkbox" id={id} className="modal-toggle" />

      <label htmlFor={id} className="modal">
        <div className="modal-box">
          <p className="content-base-300 text-center mb-2">
            {dayjs(createdAt).format('YYYY-MM-DD HH:mm')}
          </p>

          <img
            className="object-fit"
            alt="Ai generated avatar"
            loading="lazy"
            src={urls['1024x1024']}
          />

          <div className="max-w-prose text-center flex flex-col gap-2 p-4">
            <p className="content-base-200">{prompt}</p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex gap-5 flex-wrap justify-center">
              {Object.keys(urls)
                .sort((a, b) => {
                  const aSize = parseInt(a.split('x')[0]);
                  const bSize = parseInt(b.split('x')[0]);

                  return bSize - aSize;
                })
                .map(renderDownloadLink)}
            </div>

            <button
              onClick={generateVariant}
              className="btn btn-primary"
              disabled={
                !appContext.state.credits.data ||
                appContext.state.avatars.isLoading
              }
            >
              {!appContext.state.credits.data
                ? 'You have no credits'
                : 'Generate variant'}
            </button>
          </div>
        </div>
      </label>

      <label
        htmlFor={id}
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
    </React.Fragment>
  );
}

function renderAvatar(avatar: AvatarModel) {
  return <AvatarCard {...avatar} key={avatar.id} />;
}

function Avatars() {
  const appContext = React.useContext(AppContext);
  const creditsDrawerContext = React.useContext(AddCreditsDrawerContext);
  const generatePictureContext = React.useContext(GeneratePictureDrawerContext);

  const flatTree = React.useMemo(
    () => constructTreeAsList(appContext.state.avatars.data),
    [appContext.state.avatars.data],
  );

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

  if (!appContext.state.avatars.data.length) {
    return (
      <div className="w-full p-5">
        <EmptyState
          buttonOnClick={() => generatePictureContext.openDrawer()}
          buttonText="Generate picture"
          message="No pictures. Click generate picture to get started"
        />
      </div>
    );
  }

  return (
    <div
      className="w-full p-5"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(128px, 1fr))',
      }}
    >
      {flatTree.map(renderAvatar)}
    </div>
  );
}

export default function Studio(props: DefaultProps) {
  return (
    <AppProvider {...props}>
      <AuthPageContainer title="Studio" {...props}>
        <GenerateImageForm />

        <Avatars />
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
