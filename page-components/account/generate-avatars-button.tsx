import { Spinner } from '@aa/components/spinner';
import { AppConsumer, AppContextType } from '@aa/context';
import { useState } from 'react';

export function GenerateAvatarsButton() {
  const [isLoading, setIsLoading] = useState(false);

  const generateAvatarsButton = (appContext: AppContextType) => {
    const generateAvatars = async () => {
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
    };

    return (
      <button
        disabled={appContext.state.credits === 0 || isLoading}
        className="bg-sky-800 px-3 py-2 rounded text-white hover:bg-sky-700 disabled:opacity-20 disabled:pointer-events-none"
        onClick={generateAvatars}
      >
        {isLoading ? <Spinner /> : 'Generate Avatars'}
      </button>
    );
  };

  return <AppConsumer>{generateAvatarsButton}</AppConsumer>;
}
