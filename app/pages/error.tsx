import { DefaultHead } from '@aa/components/default-head';
import { MainContainer } from '@aa/containers/main-container';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import React from 'react';

export default function Error() {
  const { user } = useUser();

  return (
    <React.Fragment>
      <DefaultHead title="Error" />

      <MainContainer>
        <div className="flex flex-col gap-3 items-center p-5 mt-10">
          <h1 className="text-3xl">Error</h1>
          <p className="text-center max-w-prose">
            Oops! The page you are looking for could not be found. It may have
            been moved, renamed, or deleted. Please try checking the URL or
            using the search function to find what you are looking for.
          </p>

          {user ? (
            <Link className="btn btn-primary" href="/studio">
              Continue to your studio
            </Link>
          ) : (
            <Link className="btn btn-primary" href="/">
              Continue
            </Link>
          )}
        </div>
      </MainContainer>
    </React.Fragment>
  );
}
