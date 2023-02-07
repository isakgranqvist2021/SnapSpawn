import { PromptModel } from '@aa/models';
import {
  PropsWithChildren,
  Reducer,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';

import { DEFAULT_FORM_STATE } from './generate-avatars.constants';
import { reducer } from './generate-avatars.reducer';
import { ReducerAction } from './generate-avatars.types';

interface GenerateAvatarContextType {
  dispatch: React.Dispatch<ReducerAction>;
  state: PromptModel;
}

export const GenerateAvatarContext = createContext<GenerateAvatarContextType>({
  dispatch: () => {},
  state: DEFAULT_FORM_STATE,
});

export function GenerateAvatarProvider(props: PropsWithChildren) {
  const { children } = props;

  const [state, dispatch] = useReducer<Reducer<PromptModel, ReducerAction>>(
    reducer,
    DEFAULT_FORM_STATE,
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
