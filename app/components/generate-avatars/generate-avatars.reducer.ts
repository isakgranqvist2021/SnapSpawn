import { PromptModel } from '@aa/models';

import { ReducerAction } from './generate-avatars.types';

export function reducer(
  state: PromptModel,
  action: ReducerAction,
): PromptModel {
  switch (action.type) {
    case 'set:age':
      return { ...state, age: action.age };

    case 'set:traits':
      return { ...state, traits: action.traits };

    case 'set:gender':
      return { ...state, gender: action.gender };

    case 'set:eyeColor':
      return { ...state, eyeColor: action.eyeColor };

    case 'set:hairType':
      return { ...state, hairType: action.hairType };

    case 'set:characteristics':
      const characteristics = state.characteristics.includes(
        action.characteristics,
      )
        ? state.characteristics.filter(
            (characteristic) => characteristic !== action.characteristics,
          )
        : [action.characteristics, ...state.characteristics];

      return { ...state, characteristics };

    default:
      return state;
  }
}
