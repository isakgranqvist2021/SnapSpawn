import { LandingPage } from '@aa/components/landing-page';
import { DefaultProps } from '@aa/containers/auth-page-container';
import { loadServerSideProps } from '@aa/utils';
import { GetServerSidePropsContext } from 'next';
import React from 'react';

export default function Page(props: DefaultProps) {
  return (
    <LandingPage
      heroSection={{
        title: <React.Fragment>NSFW Generate Image</React.Fragment>,
        subtitle: (
          <React.Fragment>
            Try out <span className="text-secondary">SnapSpawn</span> for
            generating stunning images effortlessly. Generate images with{' '}
            <span className="text-secondary">custom prompts</span> to bring your
            ideas to life.
          </React.Fragment>
        ),
      }}
      title="NSFW Generate Image"
      description="Try out our best NSFW AI image generator for creating stunning visuals effortlessly."
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
