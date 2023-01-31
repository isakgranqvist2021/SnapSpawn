import { AppConsumer, AppContextType } from '@aa/context';
import { uid } from 'uid';

function renderAvatar(url: string, index: number) {
  return (
    <div key={`avatar-${index}`} className="flex flex-col gap-2 items-center">
      <img src={url} alt="" />
      <a
        href={url}
        download={uid(10)}
        className="text-green-600 hover:underline"
      >
        Download Avatar
      </a>
    </div>
  );
}

const myAvatars = (appContext: AppContextType) => (
  <div className="py-5 flex flex-wrap gap-5 items-center justify-center">
    {appContext.state.avatars.map(renderAvatar)}
    {appContext.state.avatars.length === 0 && <p>You have no avatars</p>}
  </div>
);

export function MyAvatars() {
  return <AppConsumer>{myAvatars}</AppConsumer>;
}
