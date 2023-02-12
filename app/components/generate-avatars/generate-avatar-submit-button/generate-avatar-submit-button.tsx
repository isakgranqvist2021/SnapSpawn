import { Spinner } from '@aa/components/spinner';
import { useApiState } from '@aa/context/api-context';
import React from 'react';

import { useGenerateAvatarState } from '../generate-avatars.context';

export function GenerateAvatarSubmitButton() {
  const apiState = useApiState();

  const credits = apiState.credits.data;
  const isLoading = apiState.avatars.isLoading;
  const state = useGenerateAvatarState();

  return (
    <React.Fragment>
      <button
        className="btn btn-secondary relative"
        disabled={isLoading || credits === 0}
        type="submit"
      >
        {isLoading && (
          <div className="absolute z-10">
            <Spinner color="stroke-white" />
          </div>
        )}

        <span className={isLoading ? 'opacity-0' : ''}>
          {credits === 0
            ? "You don't have enough credits"
            : state.customPrompt === null
            ? 'Generate Avatar'
            : 'Generate Custom Picture'}
        </span>
      </button>
    </React.Fragment>
  );
}
