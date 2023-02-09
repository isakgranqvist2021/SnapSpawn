import { useApiState } from '@aa/context/api-context';
import { useAppDispatch, useAppState } from '@aa/context/app-context';

import { closeIcon, openIcon } from '../../icons';

export function SidebarActions() {
  const appState = useAppState();
  const apiState = useApiState();
  const appDispatch = useAppDispatch();

  const toggleAddCreditsSidebar = () =>
    appDispatch({ type: 'toggle:add-credits-sidebar' });

  const toggleGenerateAvatarSidebar = () =>
    appDispatch({ type: 'toggle:generate-avatar-sidebar' });

  if (apiState.avatars.isLoading) {
    return null;
  }

  return (
    <div className="w-full px-5 pt-5 gap-5 flex flex-col items-start sm:flex-row">
      <a
        className="link link-hover link-primary flex gap-2"
        onClick={toggleGenerateAvatarSidebar}
      >
        {appState.generateAvatarSidebarOpen ? closeIcon : openIcon}
        Generate Avatar
      </a>

      <a
        className="link link-hover link-secondary flex gap-2"
        onClick={toggleAddCreditsSidebar}
      >
        {appState.addCreditsSidebarOpen ? closeIcon : openIcon}
        Add Credits
      </a>
    </div>
  );
}
