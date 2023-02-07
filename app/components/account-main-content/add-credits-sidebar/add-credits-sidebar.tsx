import { MainContainerSidebar } from '@aa/containers/main-container';
import { useAppDispatch, useAppState } from '@aa/context/app-context';

import { AddCreditsForm } from '../../add-credits/add-credits';
import { closeIcon } from '../../icons';

export function AddCreditsSidebar() {
  const appState = useAppState();
  const appDispatch = useAppDispatch();

  const closeAddCreditsSidebar = () =>
    appDispatch({ type: 'close:add-credits-sidebar' });

  return (
    <MainContainerSidebar
      className={[
        appState.addCreditsSidebarOpen ? 'border-l-l' : 'border-l-0',
        'right-0',
      ].join(' ')}
      isOpen={appState.addCreditsSidebarOpen}
      onClose={closeAddCreditsSidebar}
      closeIcon={
        <div
          className="absolute top-3 left-5 cursor-pointer"
          onClick={closeAddCreditsSidebar}
        >
          {closeIcon}
        </div>
      }
    >
      <AddCreditsForm />
    </MainContainerSidebar>
  );
}
