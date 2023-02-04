import { useAppDispatch } from '@aa/context';
import {
  Characteristic,
  Gender,
  PromptModel,
  Traits,
} from '@aa/models/prompt.model';
import { Reducer, useCallback, useReducer, useRef, useState } from 'react';

const DEFAULT_FORM_STATE: PromptModel = {
  age: 32,
  traits: 'beard',
  gender: 'female',
  characteristics: 'casual',
};

type ReducerAction =
  | { age: number; type: 'set:age' }
  | { traits: Traits; type: 'set:traits' }
  | { gender: Gender; type: 'set:gender' }
  | { characteristics: Characteristic; type: 'set:characteristics' };

function reducer(state: PromptModel, action: ReducerAction): PromptModel {
  switch (action.type) {
    case 'set:age':
      return { ...state, age: action.age };

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

export function useGenerateAvatar() {
  const appDispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const [state, dispatch] = useReducer<Reducer<PromptModel, ReducerAction>>(
    reducer,
    DEFAULT_FORM_STATE,
  );

  const modalToggleRef = useRef<HTMLInputElement>(null);

  const generateAvatars = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await fetch('/api/avatar/generate-avatar', {
        body: JSON.stringify(state),
        method: 'POST',
      });

      if (res.status !== 200) {
        throw new Error(
          'Something went wrong. Please try again. If the problem persists, please contact support.',
        );
      }

      const data = await res.json();

      if (Array.isArray(data.avatars)) {
        appDispatch({ type: 'add:avatars', avatars: data.avatars });
        appDispatch({
          reduceCreditsBy: data.avatars.length,
          type: 'reduce:credits',
        });
      }

      modalToggleRef.current?.click();

      appDispatch({
        type: 'add:alert',
        alert: {
          message: 'Avatars generated successfully!',
          severity: 'success',
        },
      });

      setIsLoading(false);
    } catch {
      appDispatch({
        type: 'add:alert',
        alert: {
          message: 'Something went wrong. Please try again.',
          severity: 'error',
        },
      });
      setIsLoading(false);
    }
  }, [appDispatch, modalToggleRef, state]);

  return {
    dispatch,
    generateAvatars,
    isLoading,
    modalToggleRef,
    state,
  };
}
