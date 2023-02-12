import { AvatarModel, CustomPrompt, PromptModel } from '@aa/models';
import { Dispatch, useContext } from 'react';

import { AppContext } from './api.context';
import { ApiMethods, ReducerAction, StaticMethods } from './api.types';
import { getAddCredits, getGenerateAvatars } from './api.utils';

export function useRootApiMethods(
  dispatch: Dispatch<ReducerAction>,
): ApiMethods {
  const generateAvatars = getGenerateAvatars<PromptModel>(
    '/api/create',
    dispatch,
  );

  const generateCustomPicture = getGenerateAvatars<CustomPrompt>(
    '/api/create-custom-prompt',
    dispatch,
  );

  const addCredits = getAddCredits('/api/checkout_sessions', dispatch);

  return { addCredits, generateAvatars, generateCustomPicture };
}

export function useRootStaticMethods(
  dispatch: Dispatch<ReducerAction>,
): StaticMethods {
  const clearAlert = (id: string) => {
    dispatch({ type: 'alerts:remove', id });
  };

  return { clearAlert };
}

export const useApiState = () => {
  const { state } = useContext(AppContext);

  return state;
};

export const useStaticMethods = (): StaticMethods => {
  const { methods } = useContext(AppContext);

  return {
    clearAlert: methods.clearAlert,
  };
};

export const useApiMethods = (): ApiMethods => {
  const { methods } = useContext(AppContext);

  return {
    addCredits: methods.addCredits,
    generateAvatars: methods.generateAvatars,
    generateCustomPicture: methods.generateCustomPicture,
  };
};
