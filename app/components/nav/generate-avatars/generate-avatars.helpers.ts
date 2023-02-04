import { useAppDispatch, useAppState } from '@aa/context';
import { PromptOptions } from '@aa/utils/prompt';
import { Reducer, useCallback, useReducer, useRef, useState } from 'react';

const DEFAULT_FORM_STATE: PromptOptions = {
  age: 32,
  characteristics: 'leader',
  gender: 'female',
};

type ReducerAction =
  | {
      type: 'set:age';
      age: number;
    }
  | {
      type: 'set:characteristics';
      characteristics: PromptOptions['characteristics'];
    }
  | {
      type: 'set:gender';
      gender: PromptOptions['gender'];
    };

function reducer(state: PromptOptions, action: ReducerAction): PromptOptions {
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
  const appState = useAppState();

  const [isLoading, setIsLoading] = useState(false);

  const [state, dispatch] = useReducer<Reducer<PromptOptions, ReducerAction>>(
    reducer,
    DEFAULT_FORM_STATE,
  );

  const modalToggleRef = useRef<HTMLInputElement>(null);

  const generateAvatars = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await fetch('/api/avatar/generate-avatar', {
        method: 'POST',
        body: JSON.stringify(state),
      }).then((res) => res.json());

      if (Array.isArray(res.urls)) {
        appDispatch({ type: 'add:avatars', avatars: res.urls });
        appDispatch({
          type: 'reduce:credits',
          reduceCreditsBy: res.urls.length,
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
    state,
    modalToggleRef,
    credits: appState.credits,
    generateAvatars,
    isLoading,
    dispatch,
  };
}
