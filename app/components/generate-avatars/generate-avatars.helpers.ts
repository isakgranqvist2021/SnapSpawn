import { useAppDispatch } from '@aa/context';
import { Reducer, useCallback, useState } from 'react';

import {
  useGenerateAvatarDispatch,
  useGenerateAvatarState,
} from './generate-avatars.context';

export function useGenerateAvatar() {
  const appDispatch = useAppDispatch();

  const state = useGenerateAvatarState();
  const dispatch = useGenerateAvatarDispatch();

  const setIsLoading = useCallback(
    (isLoading: boolean) => dispatch({ isLoading, type: 'set:isLoading' }),
    [dispatch],
  );

  return useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await fetch('/api/avatar/generate-avatar', {
        body: JSON.stringify(state.form),
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

    appDispatch({ type: 'close:generate-avatar-sidebar' });
  }, [appDispatch, state.form]);
}
