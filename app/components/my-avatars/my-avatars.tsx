import { useAppState } from '@aa/context';
import { AvatarModel } from '@aa/models';
import Image from 'next/image';

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat(navigator.language, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(timestamp);
}

function renderAvatar(avatar: AvatarModel, index: number) {
  const { url, createdAt } = avatar;

  return (
    <a
      href={url}
      key={`avatar-${index}`}
      className="card bg-base-100 shadow-xl"
    >
      <figure>
        <Image
          width={256}
          height={256}
          src={url}
          alt="Ai generated avatar"
          loading="lazy"
        />
      </figure>
      <div className="card-body p-0 md:p-3">
        <p className="text-center">{formatDate(createdAt)}</p>
      </div>
    </a>
  );
}

export function MyAvatars() {
  const appState = useAppState();

  return (
    <div className="py-5 grid gap-5 grid-cols-2 p-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {appState.avatars.map(renderAvatar)}
      {appState.avatars.length === 0 && <p>You have no avatars</p>}
    </div>
  );
}
