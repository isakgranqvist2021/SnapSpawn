import { State } from './generate-avatars.context';
import { ReducerAction } from './generate-avatars.types';

export function reducer(state: State, action: ReducerAction): State {
  switch (action.type) {
    case 'set:isLoading':
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case 'set:age':
      return {
        ...state,
        form: {
          ...state.form,
          age: action.age,
        },
      };

    case 'set:traits':
      return {
        ...state,
        form: {
          ...state.form,
          traits: action.traits,
        },
      };

    case 'set:gender':
      return {
        ...state,
        form: {
          ...state.form,
          gender: action.gender,
        },
      };

    case 'set:eyeColor':
      return {
        ...state,
        form: {
          ...state.form,
          eyeColor: action.eyeColor,
        },
      };

    case 'set:hairType':
      return {
        ...state,
        form: {
          ...state.form,
          hairType: action.hairType,
        },
      };

    case 'set:characteristics':
      return {
        ...state,
        form: {
          ...state.form,
          characteristics: state.form.characteristics.includes(
            action.characteristics,
          )
            ? state.form.characteristics.filter(
                (characteristic) => characteristic !== action.characteristics,
              )
            : [action.characteristics, ...state.form.characteristics],
        },
      };

    default:
      return state;
  }
}
