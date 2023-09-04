import { AvatarModel, Size } from '@aa/models/avatar';
import { PromptModel } from '@aa/models/prompt';
import getStripe from '@aa/services/stripe';
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
}

interface AppProviderProps {
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

type ReducerAction =
  | AlertReducerAction
  | CreditsReducerAction
  | AvatarsReducerAction;

interface AppContextType {
  methods: {
    clearAlert: (id: string) => void;
    addCredits: (payload: number) => Promise<void>;
    generateAvatars: (
      payload: PromptModel,
      size: Size,
      n: number,
    ) => Promise<AvatarModel[] | null>;
    generateCustomPicture: (
      payload: string,
      size: Size,
      n: number,
    ) => Promise<AvatarModel[] | null>;
    createVariant: (
      payload: string,
      size: Size,
      n: number,
    ) => Promise<AvatarModel[] | null>;
  };
  state: AppContextState;
}

export const AppContext = createContext<AppContextType>({
  methods: {
    addCredits: async (credits: number) => {},
    clearAlert: (id: string) => {},
    generateAvatars: async (payload: PromptModel, size: Size, n: number) =>
      null,
    generateCustomPicture: async (payload: string, size: Size, n: number) =>
      null,
    createVariant: async (payload: string, size: Size, n: number) => null,
  },
  state: {
    alerts: [],
    avatars: { data: [], isLoading: false },
    credits: { data: 0, isLoading: false },
  },
});

function creditsReducer(
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

    default:
      return state;
  }
}

function avatarsReducer(
  state: AppContextState,
  action: ReducerAction,
): AppContextState {
  switch (action.type) {
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

    default:
      return state;
  }
}

function alertsReducer(
  state: AppContextState,
  action: ReducerAction,
): AppContextState {
  switch (action.type) {
    case 'alerts:add':
      return {
        ...state,
        alerts: [...state.alerts, { ...action.alert, id: uid() }],
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

function apiReducer(
  state: AppContextState,
  action: ReducerAction,
): AppContextState {
  if (action.type.startsWith('credits:')) {
    return creditsReducer(state, action);
  }

  if (action.type.startsWith('avatars:')) {
    return avatarsReducer(state, action);
  }

  if (action.type.startsWith('alerts:')) {
    return alertsReducer(state, action);
  }

  return state;
}

function getGenerateAvatars<T>(
  path: string,
  dispatch: Dispatch<ReducerAction>,
) {
  return async (payload: T, size: Size, n: number) => {
    try {
      dispatch({ type: 'avatars:set-is-loading', isLoading: true });

      const res = await fetch(path, {
        body: JSON.stringify({ options: payload, size, n }),
        method: 'POST',
      });

      if (res.status !== 200) {
        throw new Error('Invalid response');
      }

      const data: { avatars: AvatarModel[] } | undefined = await res.json();

      if (!data || !Array.isArray(data.avatars)) {
        throw new Error('Invalid response');
      }

      dispatch({ type: 'avatars:add', avatars: data.avatars });
      dispatch({
        type: 'credits:reduce',
        reduceCreditsBy: data.avatars.length,
      });
      dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'success',
          message: 'Avatar generated successfully!',
        },
      });
      dispatch({ type: 'avatars:set-is-loading', isLoading: false });

      return data.avatars;
    } catch {
      dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'error',
          message: 'Something went wrong. Please try again later.',
        },
      });
      dispatch({ type: 'avatars:set-is-loading', isLoading: false });

      return null;
    }
  };
}

function getAddCredits(path: string, dispatch: Dispatch<ReducerAction>) {
  return async (credits: number) => {
    try {
      dispatch({ type: 'credits:set-is-loading', isLoading: true });

      const stripe = await getStripe();

      if (!stripe) {
        throw new Error('Stripe is not loaded');
      }

      const res = await fetch(path, {
        body: JSON.stringify({ credits }),
        method: 'POST',
      }).then((res) => res.json());

      await stripe.redirectToCheckout({
        sessionId: res.id,
      });
    } catch {
      dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'error',
          message: 'Something went wrong. Please try again later.',
        },
      });
      dispatch({ type: 'credits:set-is-loading', isLoading: false });
    }
  };
}

function getCreateVariant(path: string, dispatch: Dispatch<ReducerAction>) {
  return async (id: string, size: Size, n: number) => {
    try {
      dispatch({ type: 'avatars:set-is-loading', isLoading: true });

      const res = await fetch(path, {
        body: JSON.stringify({ id, size, n }),
        method: 'POST',
      });

      if (res.status !== 200) {
        throw new Error('Invalid response');
      }

      const data: { avatars: AvatarModel[] } | undefined = await res.json();

      if (!data || !Array.isArray(data.avatars)) {
        throw new Error('Invalid response');
      }

      dispatch({ type: 'avatars:add', avatars: data.avatars });
      dispatch({
        type: 'credits:reduce',
        reduceCreditsBy: data.avatars.length,
      });
      dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'success',
          message: 'Variant generated successfully!',
        },
      });
      dispatch({ type: 'avatars:set-is-loading', isLoading: false });

      return data.avatars;
    } catch {
      dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'error',
          message: 'Something went wrong. Please try again later.',
        },
      });
      dispatch({ type: 'avatars:set-is-loading', isLoading: false });

      return null;
    }
  };
}

export function AppProvider(props: AppProviderProps) {
  const { avatars, children, credits } = props;

  const initialState: AppContextState = {
    alerts: [],
    avatars: { data: avatars, isLoading: false },
    credits: { data: credits, isLoading: false },
  };

  const [state, dispatch] = useReducer<Reducer<AppContextState, ReducerAction>>(
    apiReducer,
    initialState,
  );

  const clearAlert = (id: string) => {
    dispatch({ type: 'alerts:remove', id });
  };

  const generateAvatars = getGenerateAvatars<PromptModel>(
    '/api/create',
    dispatch,
  );

  const generateCustomPicture = getGenerateAvatars<string>(
    '/api/create-custom-prompt',
    dispatch,
  );

  const addCredits = getAddCredits('/api/checkout_sessions', dispatch);

  const createVariant = getCreateVariant('/api/create-variant', dispatch);

  return (
    <AppContext.Provider
      value={{
        state,
        methods: {
          addCredits,
          clearAlert,
          createVariant,
          generateAvatars,
          generateCustomPicture,
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
