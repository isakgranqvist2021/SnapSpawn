import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

const googleAnalytics = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-DMYWSZ00P0');
`;

export default function Document() {
  return (
    <Html lang="en" data-theme="light">
      <Head />
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-DMYWSZ00P0"
      ></Script>
      <Script id="google-analytics">{googleAnalytics}</Script>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
