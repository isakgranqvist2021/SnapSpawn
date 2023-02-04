import { AvatarModel } from '@aa/models';
import { Dispatch } from 'react';

type AlertSeverity = 'error' | 'info' | 'success' | 'warning';

export interface Alert {
  id: string;
  message: string;
  severity: AlertSeverity;
}

export interface AppContextState {
  addCreditsSidebarOpen: boolean;
  alerts: Alert[];
  avatars: AvatarModel[];
  credits: number;
  generateAvatarSidebarOpen: boolean;
}

export type ReducerAction =
  | { type: 'add:avatars'; avatars: AvatarModel[] }
  | { type: 'reduce:credits'; reduceCreditsBy: number }
  | { type: 'add:alert'; alert: Omit<Alert, 'id'> }
  | { type: 'remove:alert'; id: string }
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
