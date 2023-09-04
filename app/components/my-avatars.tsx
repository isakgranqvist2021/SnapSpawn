import { AppContext, ContentSidebarContext } from '@aa/context';
import { AvatarModel } from '@aa/models/avatar';
import { useContext, useEffect } from 'react';
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

function AvatarCard(props: AvatarModel) {
  const { url, createdAt, prompt } = props;

  const [isFullscreen, setIsFullscreen] = useState(false);

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
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

  if (isFullscreen) {
    return (
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

        <div className="fixed inset-8 z-20 p-5 bg-base-200 flex flex-col items-center ">
          <div className="h-4/6 flex flex-col items-center gap-3">
            <img
              className="object-fit max-h-full"
              alt="Ai generated avatar"
              loading="lazy"
              src={url}
            />

            <div className="max-w-prose text-center flex flex-col gap-2">
              <p className="content-base-300">
                {formatTimestampWithIntl(createdAt)}
              </p>

              <p className="content-base-200">{prompt}</p>
            </div>

            <a
              className="link link-primary"
              href={url}
              target="_blank"
              rel="noreferrer"
              download
            >
              Download
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundImage: `url(${url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minWidth: 256,
        minHeight: 256,
      }}
      className="cursor-pointer object-cover rounded-lg"
      onClick={openFullscreen}
    />
  );
}

function renderAvatar(avatar: AvatarModel) {
  return <AvatarCard {...avatar} key={avatar.url} />;
}

const avatarsEmptyState = (
  <EmptyState
    message="You have no photos yet. Generate one now!"
    buttonText="Generate Photo"
  />
);

function Avatars() {
  const { state } = useContext(AppContext);

  if (!state.avatars.data.length) {
    return avatarsEmptyState;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(256px, 1fr))',
        gap: '1rem',
      }}
    >
      {state.avatars.isLoading && (
        <div
          style={{
            minWidth: 256,
            minHeight: 256,
          }}
          className="flex flex-col gap-2 justify-center items-center border rounded-lg border-accent"
        >
          <Spinner />
          <p>Generating avatar...</p>
        </div>
      )}

      {state.avatars.data.map(renderAvatar)}
    </div>
  );
}

function OpenContentSidebarButton() {
  const { state } = useContext(AppContext);
  const { setIsOpen } = useContext(ContentSidebarContext);

  const openSidebar = () => setIsOpen(true);

  return (
    <button
      disabled={state.avatars.isLoading}
      className="mr-auto btn btn-secondary flex gap-2"
      onClick={openSidebar}
    >
      Generate avatar
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
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
  const { state } = useContext(AppContext);

  return (
    <div className="flex flex-col gap-5 w-full p-5">
      {state.credits.data === 0 ? (
        creditsEmptyState
      ) : (
        <OpenContentSidebarButton />
      )}

      <Avatars />
    </div>
  );
}
