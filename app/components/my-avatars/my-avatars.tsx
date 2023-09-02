import { useApiState } from '@aa/context/api-context';
import { AvatarModel } from '@aa/models';
import React from 'react';
import { useState } from 'react';

import { EmptyState } from '../empty-state';

function formatTimestampWithIntl(timestamp: number) {
  const date = new Date(timestamp);

  const locale = globalThis.navigator?.language ?? 'sv-SE';

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

/*
function AvatarCard(props: AvatarModel) {
  const { url, createdAt, prompt, promptOptions } = props;

  const pills = Object.values(promptOptions ?? {});

  const [isFlipped, setIsFlipped] = useState(false);

  const toggleCard = () => {
    setIsFlipped((isFlipped) => !isFlipped);
  };

  const renderPill = (pill: string, index: number) => {
    return (
      <div className="badge badge-md capitalize" key={`${url}-${index}`}>
        {pill}
      </div>
    );
  };

  return (
    <div
      onClick={!isFlipped ? toggleCard : undefined}
      className="bg-base-100 shadow-xl hover:shadow-2xl ease-linear duration-100 cursor-pointer"
    >
      {!isFlipped && (
        <img
          style={{ maxWidth: 256 }}
          alt="Ai generated avatar"
          loading="lazy"
          src={url}
        />
      )}

      {isFlipped && (
        <div
          className="flex flex-col gap-2 overflow-hidden"
          style={{ maxHeight: 256 }}
        >
          <div className="sticky top-0 bg-base-100 shadow-md py-3 px-5">
            <h2 className="text-xl">{formatTimestampWithIntl(createdAt)}</h2>
          </div>

          <div className="py-3 px-5 flex flex-col gap-2 overflow-auto">
            <p className="text-base">{prompt}</p>

            <div className="flex gap-3 flex-wrap">{pills.map(renderPill)}</div>

            <a className="hover:underline link-primary w-fit" href={url}>
              Download image
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
*/

function AvatarCard(props: AvatarModel) {
  const { url, createdAt, prompt, promptOptions } = props;

  const [isFullscreen, setIsFullscreen] = useState(false);

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  if (isFullscreen) {
    return (
      <div>
        <div
          onClick={closeFullscreen}
          className="z-10 fixed inset-0"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }}
        ></div>

        <div className="fixed inset-8 z-20 bg-white flex items-center justify-center">
          <img
            className="object-fit max-h-full max-w-full"
            alt="Ai generated avatar"
            loading="lazy"
            src={url}
          />
        </div>
      </div>
    );
  }

  return (
    <img
      className="cursor-pointer"
      onClick={openFullscreen}
      style={{ maxWidth: 256 }}
      alt="Ai generated avatar"
      loading="lazy"
      src={url}
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
    <div className="w-full p-5 flex flex-wrap justify-center">
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
