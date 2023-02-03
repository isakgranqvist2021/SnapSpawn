import {
  Dispatch,
  PropsWithChildren,
  Reducer,
  createContext,
  useContext,
  useReducer,
} from 'react';

interface AppContextState {
  avatars: string[];
  credits: number;
}

type ReducerAction =
  | { type: 'add:avatars'; avatars: string[] }
  | { type: 'reduce:credits'; reduceCreditsBy: number };

interface AppContextType {
  state: AppContextState;
  dispatch: Dispatch<ReducerAction>;
}

const AppContext = createContext<AppContextType>({
  dispatch: (value) => {},
  state: { avatars: [], credits: 0 },
});

function reducer(
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
  }
}

export function AppProvider(props: PropsWithChildren<AppContextState>) {
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

export const useAppState = () => useContext(AppContext).state;
export const useAppDispatch = () => useContext(AppContext).dispatch;
