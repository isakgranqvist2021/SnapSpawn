import { useApiDispatch } from '@aa/context/api-context';
import { AvatarModel } from '@aa/models';
import { AlertSeverity } from '@aa/types';
import { useCallback } from 'react';

import {
  useGenerateAvatarDispatch,
  useGenerateAvatarState,
} from './generate-avatars.context';
import { GenerateAvatarApiResponse } from './generate-avatars.types';

export function useGenerateAvatar() {
  const state = useGenerateAvatarState();
  const dispatch = useGenerateAvatarDispatch();
  const apiDispatch = useApiDispatch();

  const setResult = useCallback(
    (result: string[]) => {
      dispatch({ result, type: 'set:result' });
    },
    [dispatch],
  );

  const addAlert = useCallback(
    (severity: AlertSeverity, message: string) => {
      apiDispatch({ alert: { message, severity }, type: 'alerts:add' });
    },
    [apiDispatch],
  );

  const setIsLoading = useCallback(
    (isLoading: boolean) => {
      apiDispatch({ isLoading, type: 'avatars:set-is-loading' });
    },
    [apiDispatch],
  );

  const addAvatars = useCallback(
    (avatars: AvatarModel[]) => {
      apiDispatch({ avatars, type: 'avatars:add' });
    },
    [apiDispatch],
  );

  const reduceCreditsBy = useCallback(
    (reduceCreditsBy: number) => {
      apiDispatch({ reduceCreditsBy, type: 'credits:reduce' });
    },
    [apiDispatch],
  );

  const onGenerateAvatarsSuccess = useCallback(
    (avatars: AvatarModel[]) => {
      setResult(avatars.map((avatar: AvatarModel) => avatar.url));
      addAvatars(avatars);
      reduceCreditsBy(avatars.length);
      addAlert('success', 'Avatars generated successfully!');
      setIsLoading(false);
    },
    [addAlert, addAvatars, reduceCreditsBy, setIsLoading, setResult],
  );

  const onGenerateAvatarsError = useCallback(() => {
    setIsLoading(false);
    addAlert('error', "Couldn't generate avatars");
  }, [addAlert, setIsLoading]);

  const postFormData = useCallback(async () => {
    setIsLoading(true);

    const res = state.customPrompt
      ? await fetch('/api/create-custom-prompt', {
          body: JSON.stringify({
            customPrompt: state.customPrompt,
          }),
          method: 'POST',
        })
      : await fetch('/api/create', {
          body: JSON.stringify(state.form),
          method: 'POST',
        });

    if (res.status !== 200) {
      return null;
    }

    const data: GenerateAvatarApiResponse = await res.json();

    return data;
  }, [setIsLoading, state]);

  const generateAvatars = useCallback(async () => {
    const data = await postFormData();

    if (!data || !Array.isArray(data.avatars)) {
      onGenerateAvatarsError();
      return;
    }

    onGenerateAvatarsSuccess(data.avatars);
  }, [onGenerateAvatarsError, onGenerateAvatarsSuccess, postFormData, state]);

  return generateAvatars;
}
