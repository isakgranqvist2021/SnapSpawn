import { useUser } from '@auth0/nextjs-auth0/client';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

function HomeContent() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (error) {
      router.push('/error');
      return;
    }

    if (!user) {
      router.push('/api/auth/login');
      return;
    }

    router.push('/account');
    return;
  }, [user, error, isLoading]);

  return <p>Loading...</p>;
}

function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>Ai Avatar | Home</title>
        <meta name="description" content="Ai avatar generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <HomeContent />
      </main>
    </React.Fragment>
  );
}

export default Home;
