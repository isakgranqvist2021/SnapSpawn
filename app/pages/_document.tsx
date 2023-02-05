import clientPromise from '@aa/services/mongodb';
import { Head, Html, Main, NextScript } from 'next/document';

(async function () {
  await clientPromise;
});

export default function Document() {
  return (
    <Html lang="en" data-theme="light">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
