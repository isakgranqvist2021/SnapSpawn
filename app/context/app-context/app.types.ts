import { Dispatch } from 'react';

export interface AppContextState {
  addCreditsSidebarOpen: boolean;
  generateAvatarSidebarOpen: boolean;
}

export type ReducerAction =
  | { type: 'close:add-credits-sidebar' }
  | { type: 'close:generate-avatar-sidebar' }
  | { type: 'open:add-credits-sidebar' }
  | { type: 'open:generate-avatar-sidebar' }
  | { type: 'toggle:add-credits-sidebar' }
  | { type: 'toggle:generate-avatar-sidebar' };

export interface AppContextType {
  state: AppContextState;
  dispatch: Dispatch<ReducerAction>;
}
