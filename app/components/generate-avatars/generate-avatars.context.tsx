import { PromptModel, Size } from '@aa/models';
import {
  PropsWithChildren,
  Reducer,
  createContext,
  useContext,
  useReducer,
} from 'react';

import { DEFAULT_FORM_STATE } from './generate-avatars.constants';
import { reducer } from './generate-avatars.reducer';
import { GenerateAvatarMode, ReducerAction } from './generate-avatars.types';

export interface GenerateAvatarState {
  customPrompt: string | null;
  form: PromptModel;
  mode: GenerateAvatarMode;
  n: number;
  result: string[] | null;
  size: Size;
}

interface GenerateAvatarContextType {
  dispatch: React.Dispatch<ReducerAction>;
  state: GenerateAvatarState;
}

const INITIAL_STATE: GenerateAvatarState = {
  customPrompt: null,
  form: DEFAULT_FORM_STATE,
  mode: 'generate',
  n: 1,
  result: null,
  size: '1024x1024',
};

export const GenerateAvatarContext = createContext<GenerateAvatarContextType>({
  dispatch: () => {},
  state: INITIAL_STATE,
});

export function GenerateAvatarProvider(props: PropsWithChildren) {
  const { children } = props;

  const [state, dispatch] = useReducer<
    Reducer<GenerateAvatarState, ReducerAction>
  >(reducer, INITIAL_STATE);

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
