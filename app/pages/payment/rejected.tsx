import { DefaultHead } from '@aa/components/default-head';
import { MainContainer } from '@aa/containers/main-container';
import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';
import React from 'react';

export default function Rejected() {
  return (
    <React.Fragment>
      <DefaultHead title="Payment Rejected" />

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
