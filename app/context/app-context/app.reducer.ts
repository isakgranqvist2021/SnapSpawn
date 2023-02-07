import { uid } from 'uid';

import { AppContextState, ReducerAction } from './app.types';

export function appReducer(
  state: AppContextState,
  action: ReducerAction,
): AppContextState {
  switch (action.type) {
    case 'close:add-credits-sidebar':
      return { ...state, addCreditsSidebarOpen: false };

    case 'close:generate-avatar-sidebar':
      return { ...state, generateAvatarSidebarOpen: false };

    case 'open:add-credits-sidebar':
      return { ...state, addCreditsSidebarOpen: true };

    case 'open:generate-avatar-sidebar':
      return { ...state, generateAvatarSidebarOpen: true };

    case 'toggle:add-credits-sidebar':
      return { ...state, addCreditsSidebarOpen: !state.addCreditsSidebarOpen };

    case 'toggle:generate-avatar-sidebar':
      return {
        ...state,
        generateAvatarSidebarOpen: !state.generateAvatarSidebarOpen,
      };
  }
}
