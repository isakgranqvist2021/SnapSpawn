import {
  PropsWithChildren,
  Reducer,
  createContext,
  useContext,
  useReducer,
  useState,
} from 'react';

import { apiReducer } from './api.reducer';
import {
  ApiContextState,
  ApiContextType,
  ApiProviderProps,
  ReducerAction,
} from './api.types';

const AppContext = createContext<ApiContextType>({
  dispatch: (value) => {},
  state: {
    alerts: [],
    avatars: { data: [], isLoading: false, error: null },
    credits: { data: 0, isLoading: false, error: null },
  },
});

export function ApiProvider(props: ApiProviderProps) {
  const { avatars, children, credits, ...rest } = props;

  const [state, dispatch] = useReducer<Reducer<ApiContextState, ReducerAction>>(
    apiReducer,
    {
      alerts: [],
      avatars: { data: avatars, isLoading: false, error: null },
      credits: { data: credits, isLoading: false, error: null },
      ...rest,
    },
  );

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApiState = () => useContext(AppContext).state;
export const useApiDispatch = () => useContext(AppContext).dispatch;
