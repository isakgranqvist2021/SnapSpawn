import { useUser } from '@auth0/nextjs-auth0/client';
import { Head, Html, Main, NextScript } from 'next/document';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
