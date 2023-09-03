import { DefaultHead } from '@aa/components/default-head';
import { MainContainer } from '@aa/containers/main-container';
import Link from 'next/link';
import { Fragment } from 'react';

export default function Error() {
  return (
    <Fragment>
      <DefaultHead title="Error" />

      <MainContainer>
        <div className="flex flex-col gap-3 items-center mt-10">
          <h1 className="text-xl text-green-600">Error</h1>
          <p className="text-center max-w-prose">
            Oops! The page you are looking for could not be found. It may have
            been moved, renamed, or deleted. Please try checking the URL or
            using the search function to find what you are looking for.
          </p>

          <Link className="btn btn-error" href="/account">
            Continue to your account
          </Link>
        </div>
      </MainContainer>
    </Fragment>
  );
}
