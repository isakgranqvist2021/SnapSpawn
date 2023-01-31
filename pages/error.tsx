import Head from 'next/head';
import React from 'react';

export function Error() {
  return (
    <React.Fragment>
      <Head>
        <title>Ai Avatar | Error</title>
        <meta name="description" content="Ai avatar generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Error</h1>
      </main>
    </React.Fragment>
  );
}
