import { useApiState } from '@aa/context/api-context';
import { AvatarModel } from '@aa/models';
import Image from 'next/image';
import React from 'react';
import { useState } from 'react';

import { StatsCards } from '../stats-cards';

function formatTimestampWithIntl(timestamp: number) {
  const date = new Date(timestamp);

  const locale = globalThis.navigator?.language ?? 'sv-SE';

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

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
            <a
              className="hover:underline link-secondary w-fit flex items-center gap-2"
              onClick={toggleCard}
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
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>
              Show image
            </a>

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

function renderAvatar(avatar: AvatarModel) {
  return <AvatarCard {...avatar} key={avatar.url} />;
}

export function MyAvatars() {
  const apiState = useApiState();

  const { avatars } = apiState;

  return (
    <React.Fragment>
      <div className="pt-5 px-5 flex justify-between w-full lg:flex-nowrap flex-wrap gap-5">
        <div className="w-full">
          <StatsCards />
        </div>
      </div>
      <div className="w-full p-5 my-avatars">
        {avatars.data.map(renderAvatar)}
      </div>
    </React.Fragment>
  );
}
