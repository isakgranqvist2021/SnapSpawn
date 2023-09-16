import {
  AuthPageContainer,
  DefaultProps,
} from '@aa/containers/auth-page-container';
import { AppContext } from '@aa/context';
import { AvatarModel } from '@aa/models/avatar';
import { loadServerSideProps } from '@aa/utils';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Image from 'next/image';
import { Fragment, useContext, useEffect, useMemo, useState } from 'react';

function formatTimestampWithIntl(timestamp: number) {
  const date = new Date(timestamp);

  const locale = globalThis.navigator?.language ?? 'en-US';

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

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

  const appContext = useContext(AppContext);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const generateVariant = async () => {
    closeFullscreen();
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

  useEffect(() => {
    const onKeyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeFullscreen();
      }
    };

    window.addEventListener('keydown', onKeyDownHandler);

    return () => {
      window.removeEventListener('keydown', onKeyDownHandler);
    };
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isFullscreen]);

  return (
    <Fragment>
      {isFullscreen && (
        <div>
          <button
            onClick={closeFullscreen}
            className="btn btn-circle btn-primary fixed top-10 right-10 z-30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div
            onClick={closeFullscreen}
            className="z-10 fixed inset-0"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            }}
          ></div>

          <div className="fixed inset-8 z-20 p-5 bg-base-200 flex flex-col items-center">
            <div className="h-4/6 flex flex-col items-center gap-3">
              <img
                className="object-fit max-h-full"
                alt="Ai generated avatar"
                loading="lazy"
                src={urls['1024x1024']}
              />

              <div className="max-w-prose text-center flex flex-col gap-2">
                <p className="content-base-300">
                  {formatTimestampWithIntl(createdAt)}
                </p>

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
          </div>
        </div>
      )}

      <Image
        alt="Ai generated avatar"
        className="cursor-pointer ease-in-out transition-all duration-200 rounded-lg outline outline-4 outline-transparent hover:outline-primary"
        height={128}
        loading="lazy"
        onClick={openFullscreen}
        src={urls['128x128']}
        width={128}
        style={{ maxWidth: 128, maxHeight: 128 }}
      />
    </Fragment>
  );
}

function renderAvatar(avatar: AvatarModel) {
  return <AvatarCard {...avatar} key={avatar.id} />;
}

function Avatars() {
  const appContext = useContext(AppContext);

  const flatTree = useMemo(
    () => constructTreeAsList(appContext.state.avatars.data),
    [appContext.state.avatars.data],
  );

  return (
    <div className="flex flex-wrap gap-4 justify-center p-5">
      {flatTree.map(renderAvatar)}
    </div>
  );
}

export default function Account(props: DefaultProps) {
  return (
    <AuthPageContainer title="Account" {...props}>
      <Avatars />
    </AuthPageContainer>
  );
}

export const getServerSideProps = withPageAuthRequired({
  returnTo: '/account',
  getServerSideProps: loadServerSideProps,
});
