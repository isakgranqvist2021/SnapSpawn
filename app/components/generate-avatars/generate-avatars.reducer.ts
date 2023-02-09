import { PromptModel } from '@aa/models';

import { ReducerAction } from './generate-avatars.types';

export function reducer(
  state: PromptModel,
  action: ReducerAction,
): PromptModel {
  switch (action.type) {
    case 'set:traits':
      return { ...state, traits: action.traits };

    case 'set:gender':
      return { ...state, gender: action.gender };

    case 'set:characteristics':
      return { ...state, characteristics: action.characteristics };

    default:
      return state;
  }
}
