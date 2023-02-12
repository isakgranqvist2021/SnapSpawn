import { CustomPrompt, PromptModel } from '@aa/models';
import { Reducer, createContext, useContext, useReducer } from 'react';

import { useRootApiMethods } from './api.context.helpers';
import { apiReducer } from './api.reducer';
import {
  ApiContextState,
  ApiContextType,
  ApiMethods,
  ApiProviderProps,
  ReducerAction,
  StaticMethods,
} from './api.types';

const AppContext = createContext<ApiContextType>({
  dispatch: (value) => {},
  methods: {
    addCredits: async (credits: number) => {},
    clearAlert: (id: string) => {},
    generateAvatars: async (payload: PromptModel) => null,
    generateCustomPicture: async (payload: CustomPrompt) => null,
  },
  state: {
    alerts: [],
    avatars: { data: [], isLoading: false, error: null },
    credits: { data: 0, isLoading: false, error: null },
  },
});

export function ApiProvider(props: ApiProviderProps) {
  const { avatars, children, credits } = props;

  const [state, dispatch] = useReducer<Reducer<ApiContextState, ReducerAction>>(
    apiReducer,
    {
      alerts: [],
      avatars: { data: avatars, isLoading: false, error: null },
      credits: { data: credits, isLoading: false, error: null },
    },
  );

  const clearAlert = (id: string) => {
    dispatch({ type: 'alerts:remove', id });
  };

  const apiMethods = useRootApiMethods(dispatch);

  return (
    <AppContext.Provider
      value={{ state, dispatch, methods: { ...apiMethods, clearAlert } }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApiState = () => useContext(AppContext).state;

export const useStaticMethods = (): StaticMethods => {
  const { methods } = useContext(AppContext);

  return {
    clearAlert: methods.clearAlert,
  };
};

export const useApiMethods = (): ApiMethods => {
  const { methods } = useContext(AppContext);

  return {
    addCredits: methods.addCredits,
    generateAvatars: methods.generateAvatars,
    generateCustomPicture: methods.generateCustomPicture,
  };
};
