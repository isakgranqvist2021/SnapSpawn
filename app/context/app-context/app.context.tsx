import {
  PropsWithChildren,
  Reducer,
  createContext,
  useContext,
  useReducer,
} from 'react';

import { appReducer } from './app.reducer';
import { AppContextState, AppContextType, ReducerAction } from './app.types';

const AppContext = createContext<AppContextType>({
  dispatch: (value) => {},
  state: {
    addCreditsSidebarOpen: false,
    generateAvatarSidebarOpen: false,
  },
});

export function AppProvider(
  props: PropsWithChildren<Partial<AppContextState>>,
) {
  const { children, ...rest } = props;

  const [state, dispatch] = useReducer<Reducer<AppContextState, ReducerAction>>(
    appReducer,
    {
      addCreditsSidebarOpen: false,
      generateAvatarSidebarOpen: false,
      ...rest,
    },
  );

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppState = () => useContext(AppContext).state;
export const useAppDispatch = () => useContext(AppContext).dispatch;
