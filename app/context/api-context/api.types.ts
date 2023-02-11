import { AvatarModel } from '@aa/models';
import { Alert } from '@aa/types';
import { Dispatch } from 'react';

interface ApiState<T, E = null> {
  data: T;
  error: E;
  isLoading: boolean;
}

export interface ApiContextState {
  alerts: Alert[];
  avatars: ApiState<AvatarModel[]>;
  credits: ApiState<number>;
}

export interface ApiProviderProps {
  avatars: AvatarModel[];
  children: React.ReactNode;
  credits: number;
}

type AlertReducerAction =
  | { type: 'alerts:add'; alert: Omit<Alert, 'id'> }
  | { type: 'alerts:remove'; id: string };

type CreditsReducerAction =
  | { type: 'credits:reduce'; reduceCreditsBy: number }
  | { type: 'credits:set-is-loading'; isLoading: boolean };

type AvatarsReducerAction =
  | { type: 'avatars:add'; avatars: AvatarModel[] }
  | { type: 'avatars:set-is-loading'; isLoading: boolean };

export type ReducerAction =
  | AlertReducerAction
  | CreditsReducerAction
  | AvatarsReducerAction;

export interface ApiContextType {
  state: ApiContextState;
  dispatch: Dispatch<ReducerAction>;
}
