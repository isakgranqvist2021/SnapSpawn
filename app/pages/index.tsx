import { DefaultHead } from '@aa/components/default-head';
import { Nav } from '@aa/components/nav';
import { MainContainer } from '@aa/containers/main-container';
import { UserProvider, useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import React from 'react';

function HeroSection() {
  const { user } = useUser();

  return (
    <div className="hero min-h-screen">
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Ai Portrait Studio</h1>
          <p className="mb-5">
            Create professional & stunning digital portraits with ease using Ai
            Portrait Studio. AI-powered & user-friendly. Get started now!
          </p>
          <Link
            href={user ? '/account' : '/api/auth/login'}
            className="btn btn-accent"
          >
            {user ? 'Continue to your account' : 'Get started'}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <React.Fragment>
      <DefaultHead title="Home" />

      <MainContainer>
        <Nav className="navbar bg-base-200 flex fixed z-30" />

        <HeroSection />
      </MainContainer>
    </React.Fragment>
  );
}

export default Home;
