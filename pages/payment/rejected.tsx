import { MainContainer } from '@aa/containers';
import { getButtonClassName } from '@aa/utils/styles';
import Head from 'next/head';
import React from 'react';

export default function Rejected() {
  return (
    <React.Fragment>
      <Head>
        <title>Ai Avatar | Rejected</title>
        <meta name="description" content="Ai avatar generator" />
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

          <a
            className={getButtonClassName({
              bgColor: 'bg-red-800',
              textColor: 'text-white',
              hoverBgColor: 'bg-red-700',
            })}
            href="/account"
          >
            Continue to your account
          </a>
        </div>
      </MainContainer>
    </React.Fragment>
  );
}
