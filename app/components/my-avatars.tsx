import { AppContext, ContentSidebarContext } from '@aa/context';
import { AvatarModel } from '@aa/models/avatar';
import Image from 'next/image';
import { Fragment, useContext, useEffect } from 'react';
import { useState } from 'react';

import { EmptyState } from './empty-state';
import { Spinner } from './spinner';

function formatTimestampWithIntl(timestamp: number) {
  const date = new Date(timestamp);

  const locale = globalThis.navigator?.language ?? 'en-US';

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function sortUrlsBySize(a: string, b: string) {
  const aSize = parseInt(a.split('x')[0]);
  const bSize = parseInt(b.split('x')[0]);

  return bSize - aSize;
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
                    .sort(sortUrlsBySize)
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
                  Generate variant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Image
        alt="Ai generated avatar"
        className="cursor-pointer ease-in-out transition-all duration-200 rounded-lg outline outline-4 outline-transparent hover:outline-primary"
        height={144}
        loading="lazy"
        onClick={openFullscreen}
        src={urls['128x128']}
        width={144}
      />
    </Fragment>
  );
}

function renderAvatar(avatar: AvatarModel) {
  return <AvatarCard {...avatar} key={avatar.id} />;
}

const avatarsEmptyState = (
  <EmptyState
    message="You have no pictures yet. Generate one now!"
    buttonText="Generate Picture"
  />
);

function FirstAvatarGridItem() {
  const appContext = useContext(AppContext);
  const contentSidebarContext = useContext(ContentSidebarContext);

  if (appContext.state.avatars.isLoading) {
    return (
      <div
        style={{
          minWidth: 144,
          minHeight: 144,
        }}
        className="flex flex-col gap-2 justify-center items-center rounded-lg outline outline-4 outline-accent"
      >
        <Spinner />
        <p>Generating</p>
      </div>
    );
  }

  const openSidebar = () => contentSidebarContext.setIsOpen(true);

  return (
    <div
      style={{
        minWidth: 144,
        minHeight: 144,
      }}
      className="flex flex-col gap-2 justify-center items-center ease-in-out transition-all duration-200 rounded-lg cursor-pointer outline outline-4 outline-accent hover:outline-accent-focus"
      onClick={openSidebar}
      role="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );
}

function Avatars() {
  const appContext = useContext(AppContext);

  if (!appContext.state.avatars.data.length) {
    return avatarsEmptyState;
  }

  return (
    <div className="flex flex-wrap gap-4">
      <FirstAvatarGridItem />

      {appContext.state.avatars.data.map(renderAvatar)}
    </div>
  );
}

const creditsEmptyState = (
  <EmptyState
    message="You have no credits yet. Add some now!"
    buttonHref="/refill"
    buttonText="Add Credits"
  />
);

export function MyAvatars() {
  const appContext = useContext(AppContext);

  return (
    <div className="flex flex-col gap-5 w-full p-5">
      {appContext.state.credits.data === 0 && creditsEmptyState}

      <Avatars />
    </div>
  );
}
