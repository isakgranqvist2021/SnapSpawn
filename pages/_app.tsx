import { AppContext, AppContextType, AppProvider } from '@aa/context';
import '@aa/styles/globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { AppProps } from 'next/app';
import { useState } from 'react';

function useAppContext() {
  const [state, setState] = useState<{
    credits: number;
    avatars: string[];
  }>({
    credits: 1,
    avatars: [],
  });

  const appContext: AppContextType = {
    avatars: {
      value: state.avatars,
      setValue: (value) =>
        setState((prevState) => ({
          ...prevState,
          avatars: value,
        })),
    },
    credits: {
      value: state.credits,
      setValue: (value) =>
        setState((prevState) => ({
          ...prevState,
          credits: value,
        })),
    },
  };

  return appContext;
}

function App(props: AppProps) {
  const { Component, pageProps } = props;

  const appContext = useAppContext();

  return (
    <UserProvider>
      <AppProvider value={appContext}>
        <Component {...pageProps} />
      </AppProvider>
    </UserProvider>
  );
}

export default App;
