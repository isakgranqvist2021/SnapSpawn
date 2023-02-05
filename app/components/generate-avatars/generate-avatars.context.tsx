import { PromptModel } from '@aa/models';
import {
  PropsWithChildren,
  Reducer,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import { DEFAULT_STATE } from './generate-avatars.constants';
import { reducer } from './generate-avatars.reducer';
import { ReducerAction } from './generate-avatars.types';

export interface State {
  form: PromptModel;
  isLoading: boolean;
}

interface GenerateAvatarContextType {
  dispatch: React.Dispatch<ReducerAction>;
  state: State;
}

export const GenerateAvatarContext = createContext<GenerateAvatarContextType>({
  dispatch: () => {},
  state: DEFAULT_STATE,
});

export function GenerateAvatarProvider(props: PropsWithChildren) {
  const { children } = props;

  const [state, dispatch] = useReducer<Reducer<State, ReducerAction>>(
    reducer,
    DEFAULT_STATE,
  );

  return (
    <GenerateAvatarContext.Provider value={{ dispatch, state }}>
      {children}
    </GenerateAvatarContext.Provider>
  );
}

export const useGenerateAvatarState = () =>
  useContext(GenerateAvatarContext).state;

export const useGenerateAvatarDispatch = () =>
  useContext(GenerateAvatarContext).dispatch;
