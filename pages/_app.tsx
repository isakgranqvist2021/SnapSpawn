import { AppProvider } from '@aa/context';
import '@aa/styles/globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { AppProps } from 'next/app';

function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <UserProvider>
      <AppProvider>
        <Component {...pageProps} />
      </AppProvider>
    </UserProvider>
  );
}

export default App;
