import { Spinner } from '@aa/components/spinner';
import { useAppState } from '@aa/context';
import React from 'react';

import { useGenerateAvatarState } from '../generate-avatars.context';

export function GenerateAvatarSubmitButton() {
  const state = useGenerateAvatarState();

  const isLoading = state.isLoading;

  const { credits } = useAppState();

  return (
    <React.Fragment>
      {credits !== 0 && <p className="mb-3">You have {credits} credits</p>}

      <button
        className="btn btn-secondary w-full relative"
        disabled={isLoading || credits === 0}
        type="submit"
      >
        {isLoading && (
          <div className="absolute z-10">
            <Spinner color="stroke-white" />
          </div>
        )}

        <span className={isLoading ? 'opacity-0' : ''}>
          {credits === 0 ? "You don't have enough credits" : 'Generate Avatar'}
        </span>
      </button>
    </React.Fragment>
  );
}
