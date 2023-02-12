import '@aa/styles/globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';

function App(props: AppProps) {
  const { Component, pageProps } = props;

  useEffect(() => {
    console.log('qwt');
  }, []);

  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default App;
