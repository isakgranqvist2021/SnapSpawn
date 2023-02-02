import { AppConsumer, AppContextType } from '@aa/context';

function renderAvatar(url: string, index: number) {
  return (
    <a href={url} key={`avatar-${index}`}>
      <img src={url} alt="Ai generated avatar" loading="lazy" />
    </a>
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
