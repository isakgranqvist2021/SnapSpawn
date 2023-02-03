import { useAppDispatch, useAppState } from '@aa/context';
import { PromptOptions } from '@aa/utils/prompt';
import { useCallback, useContext, useState } from 'react';

function reducer() {}

export function useGenerateAvatar() {
  const dispatch = useAppDispatch();
  const appState = useAppState();

  const [isLoading, setIsLoading] = useState(false);

  const [promptOptions, setPromptOptions] = useState<PromptOptions>({
    age: 32,
    characteristics: 'leader',
    gender: 'female',
  });

  const generateAvatars = useCallback(async () => {
    setIsLoading(true);

    const res = await fetch('/api/avatar/generate-avatar', {
      method: 'POST',
      body: JSON.stringify(promptOptions),
    }).then((res) => res.json());

    if (Array.isArray(res.urls)) {
      dispatch({ type: 'add:avatars', avatars: res.urls });
      dispatch({
        type: 'reduce:credits',
        reduceCreditsBy: res.urls.length,
      });
    }

    setIsLoading(false);
  }, [dispatch, isLoading]);

  return { credits: appState.credits, generateAvatars, isLoading };
}
