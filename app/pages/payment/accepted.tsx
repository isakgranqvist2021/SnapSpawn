import { MainContainer } from '@aa/containers/main-container';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

export default function Accepted() {
  return (
    <React.Fragment>
      <Head>
        <title>AI Portrait Studio | Payment Accepted</title>
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
          <h1 className="text-xl text-green-600">
            Your payment has been accepted
          </h1>
          <p className="text-center max-w-prose">
            We are pleased to confirm that your payment has been received
            successfully. Your account will be credited with the coins
            immediately.
          </p>

          <Link className="btn btn-success" href="/account">
            Continue to your account
          </Link>
        </div>
      </MainContainer>
    </React.Fragment>
  );
}
