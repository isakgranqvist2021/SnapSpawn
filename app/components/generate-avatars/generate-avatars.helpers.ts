import { useApiDispatch } from '@aa/context/api-context';
import { useAppDispatch } from '@aa/context/app-context';
import { AvatarModel } from '@aa/models';
import { AlertSeverity } from '@aa/types';
import { useCallback } from 'react';

import { useGenerateAvatarState } from './generate-avatars.context';

function useGenerateAvatarActions() {
  const apiDispatch = useApiDispatch();

  const addAlert = (severity: AlertSeverity, message: string) => {
    apiDispatch({ alert: { message, severity }, type: 'alerts:add' });
  };

  const setIsLoading = (isLoading: boolean) => {
    apiDispatch({ isLoading, type: 'avatars:set-is-loading' });
  };

  const addAvatars = (avatars: AvatarModel[]) => {
    apiDispatch({ avatars, type: 'avatars:add' });
  };

  const reduceCreditsBy = (reduceCreditsBy: number) => {
    apiDispatch({ reduceCreditsBy, type: 'credits:reduce' });
  };

  return { addAlert, addAvatars, reduceCreditsBy, setIsLoading };
}

export function useGenerateAvatar() {
  const appDispatch = useAppDispatch();

  const state = useGenerateAvatarState();

  const { addAlert, addAvatars, reduceCreditsBy, setIsLoading } =
    useGenerateAvatarActions();

  return useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await fetch('/api/avatar/generate-avatar', {
        body: JSON.stringify(state),
        method: 'POST',
      });

      if (res.status !== 200) {
        setIsLoading(false);
        addAlert('error', 'Something went wrong. Please try again.');
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data.avatars)) {
        setIsLoading(false);
        addAlert('error', 'Something went wrong. Please try again.');
        return;
      }

      addAvatars(data.avatars);
      reduceCreditsBy(data.avatars.length);
      addAlert('success', 'Avatars generated successfully!');
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      addAlert('error', 'Something went wrong. Please try again.');
    }

    appDispatch({ type: 'close:generate-avatar-sidebar' });
  }, [addAlert, addAvatars, appDispatch, reduceCreditsBy, setIsLoading, state]);
}
