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
        className={[
          'relative bg-sky-800 text-sm px-2 py-1 rounded text-white hover:bg-sky-700 disabled:pointer-events-none flex items-center justify-center',
          appContext.state.credits === 0 ? 'opacity-50' : '',
        ].join(' ')}
        onClick={generateAvatars}
      >
        {isLoading && (
          <div className="absolute z-10">
            <Spinner color="stroke-white" />
          </div>
        )}

        <span className={isLoading ? 'opacity-0' : ''}>Generate Avatar</span>
      </button>
    );
  };

  return <AppConsumer>{generateAvatarsButton}</AppConsumer>;
}
