import { useAppDispatch } from '@aa/context';
import { Characteristic, Gender, PromptModel } from '@aa/models/prompt.model';
import { Reducer, useCallback, useReducer, useRef, useState } from 'react';

const DEFAULT_FORM_STATE: PromptModel = {
  age: 32,
  characteristics: 'casual',
  gender: 'female',
};

type ReducerAction =
  | { age: number; type: 'set:age' }
  | { characteristics: Characteristic; type: 'set:characteristics' }
  | { gender: Gender; type: 'set:gender' };

function reducer(state: PromptModel, action: ReducerAction): PromptModel {
  switch (action.type) {
    case 'set:age':
      return { ...state, age: action.age };

    case 'set:characteristics':
      return { ...state, characteristics: action.characteristics };

    case 'set:gender':
      return { ...state, gender: action.gender };

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
      }).then((res) => res.json());

      if (Array.isArray(res.avatars)) {
        appDispatch({ type: 'add:avatars', avatars: res.avatars });
        appDispatch({
          reduceCreditsBy: res.avatars.length,
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
