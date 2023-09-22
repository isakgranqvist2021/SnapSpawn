import { AvatarModel } from '@aa/models/avatar';
import { ReferralModel } from '@aa/models/referral';
import { Alert } from '@aa/types';
import { Dispatch, Reducer, createContext, useReducer } from 'react';
import { uid } from 'uid';

interface ApiState<T> {
  data: T;
  isLoading: boolean;
}

interface AppContextState {
  alerts: Alert[];
  avatars: ApiState<AvatarModel[]>;
  credits: ApiState<number>;
  referrals: ApiState<ReferralModel[]>;
  upload: ApiState<null>;
  deleteReferral: ApiState<null>;
}

interface AppProviderProps {
  avatars: AvatarModel[];
  children: React.ReactNode;
  credits: number;
  referrals: ReferralModel[];
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

type ReferralsReducerAction =
  | { type: 'referrals:add'; referrals: ReferralModel[] }
  | { type: 'referrals:set-is-loading'; isLoading: boolean }
  | { type: 'referrals:remove'; id: string }
  | { type: 'delete-referral:set-is-loading'; isLoading: boolean };

type UploadReducerAction = {
  type: 'upload:set-is-loading';
  isLoading: boolean;
};

type ReducerAction =
  | AlertReducerAction
  | CreditsReducerAction
  | AvatarsReducerAction
  | UploadReducerAction
  | ReferralsReducerAction;

interface AppContextType {
  dispatch: Dispatch<ReducerAction>;
  state: AppContextState;
}

export const AppContext = createContext<AppContextType>({
  dispatch: () => {},
  state: {
    alerts: [],
    avatars: { data: [], isLoading: false },
    credits: { data: 0, isLoading: false },
    referrals: { data: [], isLoading: false },
    upload: { data: null, isLoading: false },
    deleteReferral: { data: null, isLoading: false },
  },
});

function apiReducer(
  state: AppContextState,
  action: ReducerAction,
): AppContextState {
  switch (action.type) {
    case 'credits:reduce':
      return {
        ...state,
        credits: {
          ...state.credits,
          data: state.credits.data - action.reduceCreditsBy,
        },
      };

    case 'credits:set-is-loading':
      return {
        ...state,
        credits: { ...state.credits, isLoading: action.isLoading },
      };

    case 'avatars:add':
      return {
        ...state,
        avatars: {
          ...state.avatars,
          data: [...action.avatars, ...state.avatars.data],
        },
      };

    case 'avatars:set-is-loading':
      return {
        ...state,
        avatars: {
          ...state.avatars,
          isLoading: action.isLoading,
        },
      };

    case 'referrals:add':
      return {
        ...state,
        referrals: {
          ...state.referrals,
          data: [...action.referrals, ...state.referrals.data],
        },
      };

    case 'referrals:set-is-loading':
      return {
        ...state,
        referrals: {
          ...state.referrals,
          isLoading: action.isLoading,
        },
      };

    case 'alerts:add':
      return {
        ...state,
        alerts: [...state.alerts, { ...action.alert, id: uid() }],
      };

    case 'upload:set-is-loading':
      return {
        ...state,
        upload: {
          ...state.upload,
          isLoading: action.isLoading,
        },
      };

    case 'referrals:remove':
      return {
        ...state,
        referrals: {
          ...state.referrals,
          data: state.referrals.data.filter(
            (referral) => referral.id !== action.id,
          ),
        },
      };

    case 'delete-referral:set-is-loading':
      return {
        ...state,
        deleteReferral: {
          ...state.deleteReferral,
          isLoading: action.isLoading,
        },
      };

    case 'alerts:remove':
      const alerts = [...state.alerts];
      const index = alerts.findIndex((alert) => alert.id === action.id);
      alerts.splice(index, 1);
      return { ...state, alerts };

    default:
      return state;
  }
}

export function AppProvider(props: AppProviderProps) {
  const { avatars, children, referrals, credits } = props;

  const initialState: AppContextState = {
    alerts: [],
    avatars: { data: avatars, isLoading: false },
    credits: { data: credits, isLoading: false },
    referrals: { data: referrals, isLoading: false },
    upload: { data: null, isLoading: false },
    deleteReferral: { data: null, isLoading: false },
  };

  const [state, dispatch] = useReducer<Reducer<AppContextState, ReducerAction>>(
    apiReducer,
    initialState,
  );

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
