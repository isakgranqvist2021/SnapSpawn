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

      <Script id="tiktok-analytics" strategy="afterInteractive">
        {`
            !(function (w, d, t) {
                w.TiktokAnalyticsObject = t;
                var ttq = (w[t] = w[t] || []);
                (ttq.methods = [
                    'page',
                    'track',
                    'identify',
                    'instances',
                    'debug',
                    'on',
                    'off',
                    'once',
                    'ready',
                    'alias',
                    'group',
                    'enableCookie',
                    'disableCookie',
                ]),
                    (ttq.setAndDefer = function (t, e) {
                        t[e] = function () {
                            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
                        };
                    });
                for (var i = 0; i < ttq.methods.length; i++)
                    ttq.setAndDefer(ttq, ttq.methods[i]);
                (ttq.instance = function (t) {
                    for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++)
                        ttq.setAndDefer(e, ttq.methods[n]);
                    return e;
                }),
                    (ttq.load = function (e, n) {
                        var i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
                        (ttq._i = ttq._i || {}),
                            (ttq._i[e] = []),
                            (ttq._i[e]._u = i),
                            (ttq._t = ttq._t || {}),
                            (ttq._t[e] = +new Date()),
                            (ttq._o = ttq._o || {}),
                            (ttq._o[e] = n || {});
                        var o = document.createElement('script');
                        (o.type = 'text/javascript'),
                            (o.async = !0),
                            (o.src = i + '?sdkid=' + e + '&lib=' + t);
                        var a = document.getElementsByTagName('script')[0];
                        a.parentNode.insertBefore(o, a);
                    });

                ttq.load('CFIKAKJC77U6VUESL250');
                ttq.page();
            })(window, document, 'ttq');
        `}
      </Script>
    </React.Fragment>
  );
}
