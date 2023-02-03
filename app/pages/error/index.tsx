import { MainContainer } from '@aa/containers';
import Head from 'next/head';
import React from 'react';

export default function Error() {
  return (
    <React.Fragment>
      <Head>
        <title>AI Portrait Studio | Error</title>
        <meta
          name="description"
          content="Get instant, custom portraits at AI Portrait Studio. Our AI technology generates unique images based on your photos. Create a personalized work of art in minutes."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="AI technology, Portraits, Custom, Images, Personalized, Photos, Art, Instant, Generates, Unique, Memories, Work of art, Advanced technology, Skilled artists"
        />
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainContainer>
        <h1>Error</h1>
      </MainContainer>
    </React.Fragment>
  );
}
