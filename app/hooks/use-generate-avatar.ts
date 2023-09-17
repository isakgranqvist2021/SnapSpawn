import { AppContext } from '@aa/context';
import { AvatarModel } from '@aa/models/avatar';
import { GeneralAvatarModel } from '@aa/models/prompt';
import { useContext } from 'react';

export function useGenerateAvatar() {
  const appContext = useContext(AppContext);

  return async (options: GeneralAvatarModel) => {
    try {
      appContext.dispatch({ type: 'avatars:set-is-loading', isLoading: true });

      const res = await fetch('/api/create', {
        body: JSON.stringify({
          options,
        }),
        method: 'POST',
      });

      if (res.status !== 200) {
        throw new Error('Invalid response');
      }

      const data: { avatars: AvatarModel[] } | undefined = await res.json();

      if (!data || !Array.isArray(data.avatars)) {
        throw new Error('Invalid response');
      }

      appContext.dispatch({ type: 'avatars:add', avatars: data.avatars });
      appContext.dispatch({
        type: 'credits:reduce',
        reduceCreditsBy: data.avatars.length,
      });
      appContext.dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'success',
          message: 'Avatar generated successfully!',
        },
      });
      appContext.dispatch({ type: 'avatars:set-is-loading', isLoading: false });

      return data.avatars;
    } catch {
      appContext.dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'error',
          message: 'Something went wrong. Please try again later.',
        },
      });
      appContext.dispatch({ type: 'avatars:set-is-loading', isLoading: false });

      return null;
    }
  };
}

export function useGenerateCustomPicture() {
  const appContext = useContext(AppContext);

  return async (prompt: string) => {
    try {
      appContext.dispatch({ type: 'avatars:set-is-loading', isLoading: true });

      const res = await fetch('/api/create-custom-prompt', {
        body: JSON.stringify({
          options: prompt,
        }),
        method: 'POST',
      });

      if (res.status !== 200) {
        throw new Error('Invalid response');
      }

      const data: { avatars: AvatarModel[] } | undefined = await res.json();

      if (!data || !Array.isArray(data.avatars)) {
        throw new Error('Invalid response');
      }

      appContext.dispatch({ type: 'avatars:add', avatars: data.avatars });
      appContext.dispatch({
        type: 'credits:reduce',
        reduceCreditsBy: data.avatars.length,
      });
      appContext.dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'success',
          message: 'Avatar generated successfully!',
        },
      });
      appContext.dispatch({ type: 'avatars:set-is-loading', isLoading: false });

      return data.avatars;
    } catch {
      appContext.dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'error',
          message: 'Something went wrong. Please try again later.',
        },
      });
      appContext.dispatch({ type: 'avatars:set-is-loading', isLoading: false });

      return null;
    }
  };
}
