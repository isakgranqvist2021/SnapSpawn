import { Spinner } from '@aa/components/spinner';
import { useApiState } from '@aa/context/api-context';
import { AvatarModel } from '@aa/models';
import Image from 'next/image';
import React, { useId } from 'react';

import { AvatarsStatsCard, CreditsStatsCard } from '../sidebar-actions';

function formatTimestampWithIntl(timestamp: number) {
  const date = new Date(timestamp);

  const locale = globalThis.navigator?.language ?? 'sv-SE';

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function renderAvatar(avatar: AvatarModel, index: number) {
  const { url, createdAt, prompt } = avatar;

  const pills = prompt.split('&').map((pair) => {
    const [_, value] = pair.split('=');

    return value;
  });

  const id = useId();

  const renderPill = (pill: string, index: number) => {
    return (
      <div
        className="badge badge-outline capitalize"
        key={`pill-${id}-${index}`}
      >
        {pill}
      </div>
    );
  };

  return (
    <a
      href={url}
      key={`avatar-${index}`}
      className="card bg-base-100 shadow-xl hover:shadow-2xl ease-linear duration-100"
    >
      <figure>
        <Image
          alt="Ai generated avatar"
          height={256}
          loading="lazy"
          src={url}
          width={256}
        />
      </figure>
      <div className="card-body items-center">
        <h2 className="card-title">{formatTimestampWithIntl(createdAt)}</h2>
        <div className="card-actions justify-end">{pills.map(renderPill)}</div>
      </div>
    </a>
  );
}

export function MyAvatars() {
  const apiState = useApiState();

  const { avatars } = apiState;

  return (
    <React.Fragment>
      <div className="pt-5 px-5 w-full">
        {avatars.isLoading && (
          <div className="w-full px-5 pt-5 flex gap-3">
            <Spinner />
            <p>Generating avatar...</p>
          </div>
        )}

        <div className="stats shadow items-center items-center flex md:items-start md:inline-grid">
          <AvatarsStatsCard />
          <CreditsStatsCard />
        </div>
      </div>

      {avatars.data.length > 0 && (
        <div className="w-full p-5 my-avatars">
          {avatars.data.map(renderAvatar)}
        </div>
      )}
    </React.Fragment>
  );
}
