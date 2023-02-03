import { AppContext } from '@aa/context';
import { useCallback, useContext, useState } from 'react';

export function useGenerateAvatar() {
  const appContext = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);

  const generateAvatars = useCallback(async () => {
    setIsLoading(true);

    const res = await fetch('/api/avatar/generate-avatar', {
      method: 'POST',
      body: JSON.stringify({
        gender: 'male',
        age: 25,
        characteristics: 'nerdy',
      }),
    }).then((res) => res.json());

    if (Array.isArray(res.urls)) {
      appContext.dispatch({ type: 'add:avatars', avatars: res.urls });
      appContext.dispatch({ type: 'reduce:credits', by: res.urls.length });
    }

    setIsLoading(false);
  }, [appContext, isLoading]);

  return { credits: appContext.state.credits, generateAvatars, isLoading };
}
