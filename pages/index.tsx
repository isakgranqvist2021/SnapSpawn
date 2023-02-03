import { Nav } from '@aa/components/nav';
import Head from 'next/head';
import React from 'react';

function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>Ai Avatar | Home</title>
        <meta name="description" content="Ai avatar generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Nav />
        <h1>Home</h1>
      </main>
    </React.Fragment>
  );
}

export default Home;
