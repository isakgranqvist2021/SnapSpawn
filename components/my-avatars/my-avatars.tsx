import { AppConsumer, AppContextType } from '@aa/context';

function renderAvatar(url: string, index: number) {
  return (
    <div className="card bg-base-100 shadow-xl" key={`avatar-${index}`}>
      <a className="avatar" href={url}>
        <div className="rounded">
          <img src={url} alt="Ai generated avatar" loading="lazy" />
        </div>
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
