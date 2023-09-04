import Head from 'next/head';
import Script from 'next/script';
import { Fragment } from 'react';

export function DefaultHead(props: { title: string }) {
  const { title } = props;

  const documentTitle = `AI Portrait Studio | ${title}`;

  return (
    <Fragment>
      <Head>
        <title>{documentTitle}</title>
        <meta
          name="description"
          content="Get instant, custom portraits at AI Portrait Studio. Our AI technology generates unique images based on your pictures. Create a personalized work of art in minutes."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="AI technology, Portraits, Custom, Images, Personalized, Pictures, Art, Instant, Generates, Unique, Memories, Work of art, Advanced technology, Skilled artists, Dall-E, Stable Diffusion"
        />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-ZJBEKLJEGY"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-ZJBEKLJEGY');
        `}
      </Script>
    </Fragment>
  );
}
