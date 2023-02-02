import { Spinner } from '@aa/components/spinner';
import { AppConsumer, AppContextType } from '@aa/context';
import { getButtonClassName } from '@aa/utils/styles';
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
        className={getButtonClassName({
          bgColor: 'bg-sky-800',
          textColor: 'text-white',
          hoverBgColor: 'bg-sky-700',
          className: 'relative',
        })}
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
