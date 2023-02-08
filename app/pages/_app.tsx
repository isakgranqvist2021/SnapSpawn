import { Logger } from '@aa/services/logger';
import '@aa/styles/globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { AppProps, NextWebVitalsMetric } from 'next/app';

export function reportWebVitals(metric: NextWebVitalsMetric) {
  Logger.log('info', metric);
}

function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default App;
