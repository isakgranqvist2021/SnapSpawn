import Head from 'next/head';
import Script from 'next/script';
import React from 'react';

interface DefaultHeadProps {
  title: string;
}

export function DefaultHead(props: DefaultHeadProps) {
  const { title } = props;

  const documentTitle = `AI Portrait Studio | ${title}`;

  return (
    <React.Fragment>
      <Head>
        <title>{documentTitle}</title>
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

      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-DMYWSZ00P0"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-DMYWSZ00P0');
        `}
      </Script>
    </React.Fragment>
  );
}
