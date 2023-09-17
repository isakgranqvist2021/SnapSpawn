import { DefaultHead } from '@aa/components/default-head';
import { MainContainer } from '@aa/containers/main-container';
import Link from 'next/link';
import { Fragment } from 'react';

export default function Rejected() {
  return (
    <Fragment>
      <DefaultHead title="Payment Rejected" />

      <MainContainer>
        <div className="flex flex-col gap-3 p-5 items-center mt-10">
          <h1 className="text-3xl">Your payment has been rejected</h1>
          <p className="text-center max-w-prose">
            We apologize for the inconvenience, but the payment has not gone
            through. Kindly review the payment information and attempt the
            payment again.
          </p>

          <Link className="btn btn-primary" href="/account">
            Continue to your account
          </Link>
        </div>
      </MainContainer>
    </Fragment>
  );
}
