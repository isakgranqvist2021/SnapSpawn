import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

function creditsToStripeAmount(credits: number) {
  if (credits === 10) {
    return 100;
  }

  if (credits === 50) {
    return 450;
  }

  return 800;
}

const MIN_AMOUNT = 10.0;
const MAX_AMOUNT = 5000.0;

function formatAmountForStripe(amount: number, currency: string): number {
  let numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });

  const parts = numberFormat.formatToParts(amount);

  let zeroDecimalCurrency: boolean = true;

  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }

  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const body = JSON.parse(req.body);
    const amount: number = creditsToStripeAmount(body.credits);

    try {
      if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
        throw new Error('Invalid amount.');
      }

      const params: Stripe.Checkout.SessionCreateParams = {
        mode: 'payment',
        submit_type: 'pay',
        payment_method_types: ['card'],
        metadata: {
          credits: body.credits,
        },
        line_items: [
          {
            price_data: {
              currency: 'EUR',
              unit_amount: amount,
              product_data: {
                name: `${body.credits} Credits`,
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/account?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/account`,
      };

      const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);

      res.status(200).json(checkoutSession);
    } catch (err) {
      res.status(500).json({
        statusCode: 500,
        message: err instanceof Error ? err.message : 'Internal server error',
      });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

export default handler;
