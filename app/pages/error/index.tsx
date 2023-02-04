import { MainContainer } from '@aa/containers';
import Head from 'next/head';
import Link from 'next/link';
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
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainContainer>
        <div className="flex flex-col gap-3 items-center mt-10">
          <h1 className="text-xl text-green-600">Error </h1>
          <p className="text-center max-w-prose">
            Oops! The page you're looking for can't be found. It may have been
            moved, renamed, or deleted. Please try checking the URL or using the
            search function to find what you're looking for.
          </p>

          <Link className="btn btn-error" href="/account">
            Continue to your account
          </Link>
        </div>
      </MainContainer>
    </React.Fragment>
  );
}
