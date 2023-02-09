import { DefaultHead } from '@aa/components/default-head';
import { MainContainer } from '@aa/containers/main-container';
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import React from 'react';

export default function Accepted() {
  return (
    <React.Fragment>
      <DefaultHead title="Payment Accepted" />

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
