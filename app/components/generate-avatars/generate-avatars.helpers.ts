import { useApiDispatch } from '@aa/context/api-context';
import { AvatarModel } from '@aa/models';
import { AlertSeverity } from '@aa/types';
import { useCallback } from 'react';

import {
  useGenerateAvatarDispatch,
  useGenerateAvatarState,
} from './generate-avatars.context';
import { GenerateAvatarApiResponse } from './generate-avatars.types';

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
  const state = useGenerateAvatarState();
  const dispatch = useGenerateAvatarDispatch();

  const { addAlert, addAvatars, reduceCreditsBy, setIsLoading } =
    useGenerateAvatarActions();

  const setResult = (result: string[]) => {
    dispatch({ result, type: 'set:result' });
  };

  const generateAvatars = useCallback(async () => {
    try {
      setIsLoading(true);

      const res = await fetch('/api/create', {
        body: JSON.stringify(state.form),
        method: 'POST',
      });

      if (res.status !== 200) {
        setIsLoading(false);
        addAlert('error', 'Something went wrong. Please try again.');
        return;
      }

      const data: GenerateAvatarApiResponse = await res.json();

      if (!data || !Array.isArray(data.avatars)) {
        setIsLoading(false);
        addAlert('error', 'Something went wrong. Please try again.');
        return;
      }

      setResult(data.avatars.map((avatar: AvatarModel) => avatar.url));
      addAvatars(data.avatars);
      reduceCreditsBy(data.avatars.length);
      addAlert('success', 'Avatars generated successfully!');
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      addAlert('error', 'Something went wrong. Please try again.');
    }
  }, [addAlert, addAvatars, reduceCreditsBy, setIsLoading, state]);

  return generateAvatars;
}
