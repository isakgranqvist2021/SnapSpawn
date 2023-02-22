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
  const { url, createdAt, prompt } = props;

  const pills = prompt.split('&').map((pair) => {
    const [_, value] = pair.split('=');

    return value;
  });

  const renderPill = (pill: string, index: number) => {
    return (
      <div className="badge badge-md capitalize" key={`${url}-${index}`}>
        {pill}
      </div>
    );
  };

  return (
    <a
      href={url}
      className="card bg-base-100 shadow-xl hover:shadow-2xl ease-linear duration-100"
    >
      <figure>
        <Image
          alt="Ai generated avatar"
          height={1024}
          loading="lazy"
          src={url}
          width={1024}
        />
      </figure>
      {/* <div className="card-body items-center">
        <h2 className="card-title">{formatTimestampWithIntl(createdAt)}</h2>
        <div className="card-actions justify-center">
          {pills.map(renderPill)}
        </div>
      </div> */}
    </a>
  );
}

function renderAvatar(avatar: AvatarModel) {
  return <AvatarCard {...avatar} key={avatar.url} />;
}

function AvatarTableRow(props: AvatarModel) {
  const { url, createdAt, promptOptions } = props;

  // const pills = prompt.split('&').map((pair) => {
  //   const [_, value] = pair.split('=');

  //   return value;
  // });

  const renderPill = (pill: string, index: number) => {
    return (
      <div className="badge badge-md capitalize" key={`${url}-${index}`}>
        {pill}
      </div>
    );
  };

  return (
    <tr>
      <td>
        <div className="flex items-center space-x-3">
          <div className="avatar">
            <div className="mask mask-squircle w-12 h-12">
              <Image width={32} height={32} src={url} alt="Avatar" />
            </div>
          </div>
        </div>
      </td>
      <td>
        <span className="text-gray-600">
          {formatTimestampWithIntl(createdAt)}
        </span>
      </td>
      {/* <td>
        <div className="flex gap-3">{pills.map(renderPill)}</div>
      </td> */}
      <td>
        <a className="btn btn-ghost btn-xs" href={url}>
          Download
        </a>
      </td>
    </tr>
  );
}

function AvatarTable() {
  const apiState = useApiState();

  const { avatars } = apiState;

  return (
    <div className="overflow-x-auto w-full">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Date</th>
            <th>Prompt</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {avatars.data.map((avatar) => (
            <AvatarTableRow {...avatar} key={avatar.url} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MyAvatars() {
  const apiState = useApiState();

  const { avatars } = apiState;

  const [mode, setMode] = useState('card');

  const switchMode = () => {
    setMode((mode) => (mode === 'card' ? 'list' : 'card'));
  };

  return (
    <React.Fragment>
      <div className="pt-5 px-5 flex justify-between w-full lg:flex-nowrap flex-wrap gap-5">
        <div className="w-full">
          <StatsCards />
        </div>

        <label className="lg:flex hidden cursor-pointer label flex flex-row-reverse gap-5">
          <span className="label-text whitespace-nowrap">
            Toggle layout mode
          </span>
          <input
            onChange={switchMode}
            type="checkbox"
            className="toggle toggle-primary"
            checked={mode === 'card'}
          />
        </label>
      </div>

      {avatars.data.length > 0 && mode === 'card' ? (
        <div className="w-full p-5 my-avatars">
          {avatars.data.map(renderAvatar)}
        </div>
      ) : (
        <div className="w-full p-5 ">
          <AvatarTable />
        </div>
      )}
    </React.Fragment>
  );
}
