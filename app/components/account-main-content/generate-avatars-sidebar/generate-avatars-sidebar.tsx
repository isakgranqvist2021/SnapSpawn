import { MainContainerSidebar } from '@aa/containers/main-container';
import { useAppDispatch, useAppState } from '@aa/context/app-context';

import { GenerateAvatars } from '../../generate-avatars/generate-avatars';
import { closeIcon } from '../../icons';

export function GenerateAvatarSidebar() {
  const appState = useAppState();
  const appDispatch = useAppDispatch();

  const closeGenerateAvatarSidebar = () =>
    appDispatch({ type: 'close:generate-avatar-sidebar' });

  return (
    <MainContainerSidebar
      className={[
        appState.addCreditsSidebarOpen ? 'border-r-l' : 'border-r-0',
        'left-0',
      ].join(' ')}
      isOpen={appState.generateAvatarSidebarOpen}
      onClose={closeGenerateAvatarSidebar}
      closeIcon={
        <div
          className="absolute top-4 right-8 cursor-pointer"
          onClick={closeGenerateAvatarSidebar}
        >
          {closeIcon}
        </div>
      }
    >
      <GenerateAvatars />
    </MainContainerSidebar>
  );
}
