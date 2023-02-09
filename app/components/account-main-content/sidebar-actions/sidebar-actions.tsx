import { useApiState } from '@aa/context/api-context';
import { useAppDispatch } from '@aa/context/app-context';

export function CreditsStatsCard() {
  const apiState = useApiState();
  const appDispatch = useAppDispatch();

  const toggleAddCreditsSidebar = () =>
    appDispatch({ type: 'toggle:add-credits-sidebar' });

  const { credits } = apiState;

  return (
    <div className="stat">
      <div className="stat-figure md:flex hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="inline-block w-8 h-8 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <div className="stat-title">Total Credits</div>
      <div className="stat-value">{credits.data}</div>
      <div className="stat-actions">
        <button onClick={toggleAddCreditsSidebar} className="btn btn-sm">
          Add Credits
        </button>
      </div>
    </div>
  );
}

export function AvatarsStatsCard() {
  const apiState = useApiState();
  const appDispatch = useAppDispatch();

  const toggleGenerateAvatarSidebar = () =>
    appDispatch({ type: 'toggle:generate-avatar-sidebar' });

  const { avatars } = apiState;

  return (
    <div className="stat">
      <div className="stat-figure md:flex hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="inline-block w-8 h-8 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      </div>

      <div className="stat-title">Total Avatars</div>
      <div className="stat-value">{avatars.data.length}</div>
      <div className="stat-actions">
        <button
          className="btn btn-sm btn-accent"
          onClick={toggleGenerateAvatarSidebar}
        >
          New Avatar
        </button>
      </div>
    </div>
  );
}
