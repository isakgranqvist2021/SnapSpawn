import { DefaultHead } from '@aa/components/default-head';
import { Footer, footerLegalLinksList } from '@aa/components/footer';
import { MainContainer } from '@aa/containers/main-container';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import React from 'react';

function FreeCreditAlert() {
  return (
    <div className="alert alert-info shadow-lg fixed z-30 rounded-none m-0">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current flex-shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>All new users get 1 free credit.</span>
      </div>
    </div>
  );
}

function HeroSection() {
  const { user } = useUser();

  return (
    <div className="hero grow py-10">
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

function HomePageFooter() {
  const { user } = useUser();

  if (user) {
    return <Footer />;
  }

  return (
    <Footer
      lists={[
        {
          title: 'Quick Links',
          links: [
            { href: '/api/auth/login', text: 'Login' },
            { href: '/account', text: 'Avatar Studio' },
          ],
        },
        footerLegalLinksList,
      ]}
    />
  );
}

function Home() {
  return (
    <React.Fragment>
      <DefaultHead title="Home" />

      <MainContainer>
        <div className="min-h-screen flex flex-col">
          <FreeCreditAlert />

          <HeroSection />

          <HomePageFooter />
        </div>
      </MainContainer>
    </React.Fragment>
  );
}

export default Home;
