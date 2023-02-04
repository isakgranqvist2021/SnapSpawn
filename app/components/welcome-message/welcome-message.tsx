import { useAppState } from '@aa/context';
import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react';

export function WelcomeMessage() {
  const { user } = useUser();
  const appState = useAppState();

  if (!user) {
    return null;
  }

  return (
    <div className="navbar bg-base-100 justify-between min-h-min py-2 px-6 md:mt-3">
      <h1>Welcome, {user.name}</h1>

      {appState.credits === 0 ? (
        <p>You have no credits left</p>
      ) : (
        <p className="text-primary">You have {appState.credits} credits</p>
      )}
    </div>
  );
}
