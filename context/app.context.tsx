import {
  Dispatch,
  PropsWithChildren,
  Reducer,
  createContext,
  useReducer,
} from 'react';

interface AppContextState {
  credits: number;
  avatars: string[];
}

interface AppProviderProps {
  credits: number;
  avatars: string[];
}

type ReducerAction =
  | {
      type: 'set:credits';
      credits: number;
    }
  | {
      type: 'set:avatars';
      avatars: string[];
    }
  | {
      type: 'add:avatars';
      avatars: string[];
    }
  | {
      type: 'reduce:credits';
      by: number;
    };

export interface AppContextType {
  state: AppContextState;
  dispatch: Dispatch<ReducerAction>;
}

export const AppContext = createContext<AppContextType>({
  dispatch: (value) => {},
  state: { avatars: [], credits: 0 },
});

function reducer(
  state: AppContextState,
  action: ReducerAction,
): AppContextState {
  switch (action.type) {
    case 'set:avatars':
      return { ...state, avatars: action.avatars };

    case 'set:credits':
      return { ...state, credits: action.credits };

    case 'add:avatars':
      return { ...state, avatars: [...state.avatars, ...action.avatars] };

    case 'reduce:credits':
      return { ...state, credits: state.credits - action.by };
  }
}

export function AppProvider(props: PropsWithChildren<AppProviderProps>) {
  const { children, ...rest } = props;

  const [state, dispatch] = useReducer<Reducer<AppContextState, ReducerAction>>(
    reducer,
    rest,
  );

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const AppConsumer = AppContext.Consumer;
