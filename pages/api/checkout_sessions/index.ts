import { creditsToStripeAmount } from '@aa/utils/credits';
import { getSession } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

const MIN_AMOUNT = 10.0;
const MAX_AMOUNT = 5000.0;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const body = JSON.parse(req.body);
    const amount: number = creditsToStripeAmount(body.credits);

    const session = await getSession(req, res);

    if (!session?.user.email) {
      throw new Error('cannot generate avatar while logged out');
    }

    try {
      if (!(amount >= MIN_AMOUNT && amount <= MAX_AMOUNT)) {
        throw new Error('Invalid amount.');
      }

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          price_data: {
            currency: 'EUR',
            unit_amount: amount,
            product_data: { name: `${body.credits} Credits` },
          },
          quantity: 1,
        },
      ];

      const params: Stripe.Checkout.SessionCreateParams = {
        mode: 'payment',
        submit_type: 'pay',
        payment_method_types: ['card'],
        customer_email: session.user.email,
        line_items: lineItems,
        success_url: `${req.headers.origin}/payment/accepted?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/payment/rejected`,
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
