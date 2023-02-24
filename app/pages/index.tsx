import { DefaultHead } from '@aa/components/default-head';
import { Footer, footerLegalLinksList } from '@aa/components/footer';
import { Nav } from '@aa/components/nav';
import { MainContainer } from '@aa/containers/main-container';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import React from 'react';

function HeroSection() {
  return (
    <div className="hero bg-base-200 mt-16">
      <div className="hero-content flex-col lg:flex-row-reverse lg:justify-center lg:items-center lg:gap-20 lg:p-20 p-6">
        <img
          alt="Hero image"
          src="/images/pexels-tim-mossholder-3345876.jpg"
          className="max-w-sm rounded-lg shadow-2xl max-w-full"
        />
        <div className="lg:mt-0 mt-4 flex flex-col lg:items-start items-center">
          <h1 className="lg:text-6xl text-4xl font-black lg:text-left text-center">
            AI Portrait Studio
          </h1>
          <p className="py-6 max-w-prose lg:text-left text-center">
            Create captivating images with ease. Our powerful tool lets you
            generate custom or pre-defined options. Unleash your creativity
            today!
          </p>
          <Link href="/api/auth/login" className="btn btn-primary lg:mx-0">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

function WhoIsItForSection() {
  return (
    <div className="container mx-auto lg:p-20 p-6">
      <h3 className="text-center mb-10 lg:text-6xl text-4xl font-extrabold">
        Generate awesome avatars
      </h3>
      <div className="flex gap-10 justify-center flex-wrap">
        <div className="avatar">
          <div className="w-24 rounded-full">
            <img alt="Avatar example" src="/images/2bf0c3c5001.webp" />
          </div>
        </div>
        <div className="avatar">
          <div className="w-24 rounded-full">
            <img alt="Avatar example" src="/images/7ccd9cdaced.webp" />
          </div>
        </div>
        <div className="avatar">
          <div className="w-24 rounded-full">
            <img alt="Avatar example" src="/images/657cb18aa14.webp" />
          </div>
        </div>
        <div className="avatar">
          <div className="w-24 rounded-full">
            <img alt="Avatar example" src="/images/a6f45290f2b.webp" />
          </div>
        </div>
        <div className="avatar">
          <div className="w-24 rounded-full">
            <img alt="Avatar example" src="/images/eb73e28e1b0.webp" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BenefitsSection() {
  return (
    <div className="bg-base-200 lg:p-20 px-8 py-20">
      <div className="mx-auto hero-content flex-col lg:flex-row lg:justify-center lg:items-center lg:gap-20">
        <img
          width={300}
          alt="Creativity image"
          src="/images/pexels-led-supermarket-577514.jpg"
          className="max-w-sm rounded-lg shadow-2xl max-w-full"
        />
        <div className="lg:mt-0 mt-4">
          <h1 className="text-2xl lg:text-5xl font-bold lg:text-left text-center">
            Custom Prompts
          </h1>
          <p className="py-6 max-w-prose lg:text-left text-center">
            Ready to bring your ideas to life? With our web app, you can ask
            DALL-E to create anything you can imagine. From whimsical creatures
            to stylish furniture, the possibilities are endless.
          </p>
        </div>
      </div>
    </div>
  );
}

function HowItWorksSection() {
  return (
    <div>
      <div className="container flex flex-col mx-auto lg:p-20 p-6 gap-10 items-center">
        <h3 className="text-center font-semibold lg:text-6xl text-4xl">
          Why should I use it?
        </h3>
        <div className="flex gap-10 justify-center flex-wrap">
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img alt="Cash image" src="/images/pexels-pixabay-47344.jpg" />
            </div>
          </div>
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img
                alt="Color wheel"
                src="/images/pexels-alexander-grey-1146851.jpg"
              />
            </div>
          </div>
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img alt="Cool ball" src="/images/pexels-pixabay-302743.jpg" />
            </div>
          </div>
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img
                alt="Bored person"
                src="/images/pexels-cottonbro-studio-4114855.jpg"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-center flex items-center gap-5 text-xs lg:text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-green-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            20 free credits to get you started on your journey
          </p>
          <p className="text-center flex items-center gap-5 text-xs lg:text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-green-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            Pre defined options to ensure solid outcomes
          </p>
          <p className="text-center flex items-center gap-5 text-xs lg:text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-green-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            Completely custom prompts to suit your needs
          </p>
          <p className="text-center flex items-center gap-5 text-xs lg:text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Boring and unoriginal images
          </p>
        </div>

        <Link href="/api/auth/login" className="btn gap-3">
          And many more
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

function CallToActionFooterSection() {
  return (
    <div className="bg-base-200">
      <div className="mx-auto lg:p-20 px-6 py-20 flex justify-center lg:justify-around container gap-10 items-center mx-auto flex-wrap">
        <h4 className="lg:text-left font-medium text-center lg:text-6xl text-4xl">
          Are you ready?
        </h4>
        <Link href="/api/auth/login" className="btn btn-primary">
          Get started
        </Link>
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
        <Nav className="navbar bg-neutral text-neutral-content flex fixed z-10" />

        <HeroSection />

        <WhoIsItForSection />

        <BenefitsSection />

        <HowItWorksSection />

        <CallToActionFooterSection />

        <HomePageFooter />
      </MainContainer>
    </React.Fragment>
  );
}

export default Home;
