import { useAppState } from '@aa/context';
import { AvatarModel } from '@aa/models';
import Image from 'next/image';

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
  const appState = useAppState();

  return (
    <div className="p-5 grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {appState.avatars.map(renderAvatar)}
      {appState.avatars.length === 0 && <p>You have no avatars</p>}
    </div>
  );
}
