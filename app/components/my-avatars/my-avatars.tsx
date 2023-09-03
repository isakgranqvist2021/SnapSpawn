import { useApiState } from '@aa/context/api-context';
import { AvatarModel } from '@aa/models';
import React from 'react';
import { useState } from 'react';

import { EmptyState } from '../empty-state';

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

  React.useEffect(() => {
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
          className="btn btn-circle fixed top-10 right-10 z-30"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
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

        <div className="fixed inset-8 z-20 p-5 bg-white flex flex-col items-center">
          <div className="h-4/6 flex flex-col items-center gap-3">
            <img
              className="object-fit max-h-full"
              alt="Ai generated avatar"
              loading="lazy"
              src={url}
            />

            <div className="max-w-prose text-center flex flex-col gap-2">
              <p className="text-secondary">
                {formatTimestampWithIntl(createdAt)}
              </p>
              <p>{prompt}</p>
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
      className="cursor-pointer object-cover"
      onClick={openFullscreen}
    />
  );
}

function renderAvatar(avatar: AvatarModel) {
  return <AvatarCard {...avatar} key={avatar.url} />;
}

const creditsEmptyState = (
  <EmptyState
    message="You have no credits yet. Add some now!"
    buttonHref="/refill"
    buttonText="Add Credits"
  />
);

const avatarsEmptyState = (
  <EmptyState
    message="You have no photos yet. Generate one now!"
    buttonText="Generate Photo"
  />
);

function Avatars() {
  const { avatars } = useApiState();

  if (!avatars.data.length) {
    return avatarsEmptyState;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(256px, 1fr))',
        gap: '1rem',
        padding: '1rem',
      }}
    >
      {avatars.data.map(renderAvatar)}
    </div>
  );
}

export function MyAvatars() {
  const apiState = useApiState();

  return (
    <div className="flex flex-col gap-5 w-full">
      {apiState.credits.data === 0 && creditsEmptyState}

      <Avatars />
    </div>
  );
}
