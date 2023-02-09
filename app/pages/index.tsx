import { Nav } from '@aa/components/nav';
import { MainContainer } from '@aa/containers/main-container';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

function HeroSection() {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage: `url("/hero-image.jpg")`,
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Ai Portrait Studio</h1>
          <p className="mb-5">
            Create professional & stunning digital portraits with ease using Ai
            Portrait Studio. AI-powered & user-friendly. Get started now!
          </p>
          <Link href="/api/auth/login" className="btn btn-accent">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>AI Portrait Studio | Home</title>
        <meta
          name="description"
          content="Get instant, custom portraits at AI Portrait Studio. Our AI technology generates unique images based on your photos. Create a personalized work of art in minutes."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="AI technology, Portraits, Custom, Images, Personalized, Photos, Art, Instant, Generates, Unique, Memories, Work of art, Advanced technology, Skilled artists"
        />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainContainer>
        <Nav />

        <HeroSection />
      </MainContainer>
    </React.Fragment>
  );
}

export default Home;
