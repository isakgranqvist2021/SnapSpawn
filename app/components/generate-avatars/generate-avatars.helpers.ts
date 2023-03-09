import { useApiMethods } from '@aa/context/api-context';
import { AvatarModel } from '@aa/models';
import { useCallback } from 'react';

import {
  useGenerateAvatarDispatch,
  useGenerateAvatarState,
} from './generate-avatars.context';

export function useGenerateAvatar() {
  const state = useGenerateAvatarState();
  const dispatch = useGenerateAvatarDispatch();
  const apiMethods = useApiMethods();

  return useCallback(async () => {
    let res: AvatarModel[] | null = null;

    if (state.mode === 'custom') {
      res = await apiMethods.generateCustomPicture(
        state.customPrompt!,
        state.size,
        state.n,
      );
    } else {
      res = await apiMethods.generateAvatars(state.form, state.size, state.n);
    }

    if (res) {
      const urls = res.map((avatar: AvatarModel) => avatar.url);
      dispatch({ result: urls, type: 'set:result' });
    }
  }, [
    apiMethods,
    dispatch,
    state.customPrompt,
    state.form,
    state.mode,
    state.n,
    state.size,
  ]);
}
