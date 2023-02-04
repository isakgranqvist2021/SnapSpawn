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
    <div className="my-3 px-6 text-center md:w-full md:text-left">
      <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
      {appState.credits === 0 ? (
        <p>You have no credits left</p>
      ) : (
        <p className="text-primary">You have {appState.credits} credits</p>
      )}
    </div>
  );
}
