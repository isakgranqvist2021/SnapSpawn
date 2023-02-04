import { uid } from 'uid';

import { AppContextState, ReducerAction } from './app.types';

export function appReducer(
  state: AppContextState,
  action: ReducerAction,
): AppContextState {
  switch (action.type) {
    case 'add:avatars':
      return {
        ...state,
        avatars: [...action.avatars, ...state.avatars],
      };

    case 'reduce:credits':
      return {
        ...state,
        credits: state.credits - action.reduceCreditsBy,
      };

    case 'add:alert':
      return {
        ...state,
        alerts: [...state.alerts, { ...action.alert, id: uid() }],
      };

    case 'remove:alert':
      const alerts = [...state.alerts];
      const index = alerts.findIndex((alert) => alert.id === action.id);
      alerts.splice(index, 1);
      return { ...state, alerts };

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
