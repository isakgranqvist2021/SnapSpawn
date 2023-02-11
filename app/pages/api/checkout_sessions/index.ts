import { STRIPE_SECRET_KEY } from '@aa/config';
import { Logger } from '@aa/services/logger';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import Stripe from 'stripe';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

const creditsMap = new Map([
  [10, 100],
  [50, 450],
  [100, 800],
]);

function getStripeCheckoutParams(credits: number, email: string, url?: string) {
  const amount = creditsMap.get(credits);

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: 'EUR',
        unit_amount: amount,
        product_data: { name: `${credits} Credits` },
      },
      quantity: 1,
    },
  ];

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    submit_type: 'pay',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: lineItems,
    success_url: `${url}/payment/accepted?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${url}/payment/rejected`,
  };

  return params;
}

export default withApiAuthRequired(async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }

    req.body = JSON.parse(req.body);

    const session = await getSession(req, res);

    if (!session?.user.email) {
      throw new Error('cannot generate avatar while logged out');
    }

    const stripeCheckoutParams = getStripeCheckoutParams(
      req.body.credits,
      session.user.email,
      req.headers.origin,
    );

    const checkoutSession = await stripe.checkout.sessions.create(
      stripeCheckoutParams,
    );

    res.status(200).json(checkoutSession);
  } catch (err) {
    Logger.log('error', err);
    res.status(500).json({
      statusCode: 500,
      message: err instanceof Error ? err.message : 'Internal server error',
    });
  }
});
