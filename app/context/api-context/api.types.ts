import { AvatarModel, CustomPrompt, PromptModel } from '@aa/models';
import { Alert } from '@aa/types';

interface ApiState<T> {
  data: T;
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

export interface ApiMethods {
  addCredits: (payload: number) => Promise<void>;
  generateAvatars: (payload: PromptModel) => Promise<AvatarModel[] | null>;
  generateCustomPicture: (
    payload: CustomPrompt,
  ) => Promise<AvatarModel[] | null>;
}

export interface StaticMethods {
  clearAlert: (id: string) => void;
}

type Methods = ApiMethods & StaticMethods;

export interface ApiContextType {
  methods: Methods;
  state: ApiContextState;
}
