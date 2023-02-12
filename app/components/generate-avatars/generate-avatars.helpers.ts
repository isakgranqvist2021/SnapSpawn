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
    const res = await (state.customPrompt
      ? apiMethods.generateCustomPicture({
          customPrompt: state.customPrompt,
        })
      : apiMethods.generateAvatars(state.form));

    if (res) {
      const urls = res.map((avatar: AvatarModel) => avatar.url);
      dispatch({ result: urls, type: 'set:result' });
    }
  }, [apiMethods, dispatch, state.form, state.customPrompt]);
}
