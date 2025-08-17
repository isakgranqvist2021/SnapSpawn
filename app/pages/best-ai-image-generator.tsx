import { LandingPage } from '@aa/components/landing-page';
import { DefaultProps } from '@aa/containers/auth-page-container';
import { loadServerSideProps } from '@aa/utils';
import { GetServerSidePropsContext } from 'next';
import React from 'react';

export default function Page(props: DefaultProps) {
  return (
    <LandingPage
      heroSection={{
        title: <React.Fragment>Best AI Image Generator</React.Fragment>,
        subtitle: (
          <React.Fragment>
            Try out <span className="text-secondary">SnapSpawn</span> for
            generating stunning images effortlessly. Generate images with{' '}
            <span className="text-secondary">custom prompts</span> to bring your
            ideas to life.
          </React.Fragment>
        ),
      }}
      title="Best AI Image Generator"
      description="Get instant, custom portraits at SnapSpawn. Our AI technology generates unique images based on your pictures. Create a personalized work of art in minutes. Generate images with Dall-E and Stable Diffusion."
      {...props}
    />
  );
}

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  try {
    return loadServerSideProps(ctx);
  } catch {
    return {
      props: {
        credits: 0,
        avatars: [],
        referrals: [],
      },
    };
  }
};
