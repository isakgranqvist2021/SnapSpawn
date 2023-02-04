import { useAppState } from '@aa/context';
import Image from 'next/image';

function renderAvatar(url: string, index: number) {
  return (
    <div className="card bg-base-100 shadow-xl" key={`avatar-${index}`}>
      <a className="avatar" href={url}>
        <div className="rounded">
          <Image
            width={256}
            height={256}
            src={url}
            alt="Ai generated avatar"
            loading="lazy"
          />
        </div>
      </a>
    </div>
  );
}

export function MyAvatars() {
  const appState = useAppState();

  return (
    <div className="py-5 flex flex-wrap gap-5 items-center justify-center">
      {appState.avatars.map(renderAvatar)}
      {appState.avatars.length === 0 && <p>You have no avatars</p>}
    </div>
  );
}
