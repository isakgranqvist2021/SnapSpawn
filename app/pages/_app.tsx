import { ThemePicker } from '@aa/components/theme-picker';
import '@aa/styles/globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { AppProps } from 'next/app';

function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <UserProvider>
      <Component {...pageProps} />

      <ThemePicker />
    </UserProvider>
  );
}

export default App;
