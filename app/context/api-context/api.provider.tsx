import { Reducer, useMemo, useReducer } from 'react';

import { AppContext } from './api.context';
import { useRootApiMethods, useRootStaticMethods } from './api.context.helpers';
import { apiReducer } from './api.reducer';
import { ApiContextState, ApiProviderProps, ReducerAction } from './api.types';

export function ApiProvider(props: ApiProviderProps) {
  const { avatars, children, credits } = props;

  const initialState: ApiContextState = {
    alerts: [],
    avatars: { data: avatars, isLoading: false },
    credits: { data: credits, isLoading: false },
  };

  const [state, dispatch] = useReducer<Reducer<ApiContextState, ReducerAction>>(
    apiReducer,
    initialState,
  );

  const staticMethods = useRootStaticMethods(dispatch);
  const apiMethods = useRootApiMethods(dispatch);

  const methods = { ...apiMethods, ...staticMethods };
  const value = { state, methods };

  const _children = useMemo(() => children, [children]);

  return <AppContext.Provider value={value}>{_children}</AppContext.Provider>;
}
