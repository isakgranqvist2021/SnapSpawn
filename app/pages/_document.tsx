import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

const googleAnalytics = `
<!-- Google tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-DMYWSZ00P0"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-DMYWSZ00P0');
</script>
`;

export default function Document() {
  return (
    <Html lang="en" data-theme="light">
      <Head />
      <Script>{googleAnalytics}</Script>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-DMYWSZ00P0"
      ></Script>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
