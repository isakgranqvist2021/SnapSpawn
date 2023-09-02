import { Spinner } from '@aa/components/spinner';
import { useApiState } from '@aa/context/api-context';
import Link from 'next/link';
import React from 'react';

interface GenerateAvatarSubmitButtonProps {
  text: string;
}

export function GenerateAvatarSubmitButton(
  props: GenerateAvatarSubmitButtonProps,
) {
  const { text } = props;

  const apiState = useApiState();

  const credits = apiState.credits.data;
  const isLoading = apiState.avatars.isLoading;

  if (credits === 0) {
    return (
      <Link href="/refill" className="btn btn-secondary">
        You have no credits left. Add some now!
      </Link>
    );
  }

  return (
    <button
      className="btn btn-secondary relative mx-auto"
      disabled={isLoading}
      type="submit"
    >
      {isLoading && (
        <div className="absolute z-10">
          <Spinner color="stroke-white" />
        </div>
      )}

      <span className={isLoading ? 'opacity-0' : ''}>{text}</span>
    </button>
  );
}
