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

export const AppContext = createContext<{
  state: AppContextState;
  dispatch: Dispatch<ReducerAction>;
}>({
  dispatch: (value) => {},
  state: { avatars: [], credits: 0 },
});

export const AppConsumer = AppContext.Consumer;

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

export function AppProvider(props: PropsWithChildren) {
  const { children } = props;

  const [state, dispatch] = useReducer<Reducer<AppContextState, ReducerAction>>(
    reducer,
    {
      avatars: [],
      credits: 0,
    },
  );

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
