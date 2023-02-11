import { PromptModel } from '@aa/models';

import { GenerateAvatarState } from './generate-avatars.context';
import { ReducerAction } from './generate-avatars.types';

export function reducer(
  state: GenerateAvatarState,
  action: ReducerAction,
): GenerateAvatarState {
  switch (action.type) {
    case 'set:traits':
      return { ...state, form: { ...state.form, traits: action.traits } };

    case 'set:gender':
      return { ...state, form: { ...state.form, gender: action.gender } };

    case 'set:characteristics':
      return {
        ...state,
        form: { ...state.form, characteristics: action.characteristics },
      };

    case 'set:result':
      return { ...state, result: [...action.result, ...(state.result ?? [])] };

    case 'clear:result':
      return { ...state, result: null };

    default:
      return state;
  }
}
