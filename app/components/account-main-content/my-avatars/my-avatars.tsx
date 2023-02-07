import { Spinner } from '@aa/components/spinner';
import { useApiState } from '@aa/context/api-context';
import { AvatarModel } from '@aa/models';
import Image from 'next/image';
import React from 'react';

import { SidebarActions } from '../sidebar-actions';

function renderAvatar(avatar: AvatarModel, index: number) {
  const { url } = avatar;

  return (
    <a
      href={url}
      key={`avatar-${index}`}
      className="card bg-base-100 shadow-xl"
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
    </a>
  );
}

export function MyAvatars() {
  const apiState = useApiState();

  const { data: avatars, isLoading } = apiState.avatars;

  return (
    <React.Fragment>
      {avatars.length > 0 && (
        <h1 className="w-full px-5 pt-5 text-2xl font-bold">
          My Avatars ({avatars.length})
        </h1>
      )}

      {isLoading && (
        <div className="w-full px-5 pt-5 flex gap-3">
          <Spinner />
          <p>Generating avatar...</p>
        </div>
      )}

      {avatars.length === 0 && (
        <p className="w-full px-5 pt-5">You have no avatars</p>
      )}

      <SidebarActions />

      {avatars.length > 0 && (
        <div className="w-full p-5 grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {avatars.map(renderAvatar)}
        </div>
      )}
    </React.Fragment>
  );
}
