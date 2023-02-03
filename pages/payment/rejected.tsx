import { MainContainer } from '@aa/containers';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

export default function Rejected() {
  return (
    <React.Fragment>
      <Head>
        <title>AI Portrait Studio | Rejected</title>
        <meta name="description" content="AI Portrait Studio generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainContainer>
        <div className="flex flex-col gap-3 items-center mt-10">
          <h1 className="text-xl text-red-600">
            Your payment has been rejected
          </h1>
          <p className="text-center max-w-prose">
            We apologize for the inconvenience, but the payment has not gone
            through. Kindly review the payment information and attempt the
            payment again.
          </p>

          <Link className="btn btn-error" href="/account">
            Continue to your account
          </Link>
        </div>
      </MainContainer>
    </React.Fragment>
  );
}
