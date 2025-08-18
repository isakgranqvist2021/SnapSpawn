import { STRIPE_SECRET_KEY } from '@aa/config';
import { COIN_FACTOR } from '@aa/constants';
import { discounts } from '@aa/database/discount';
import { DiscountModel } from '@aa/models/discount';
import { Logger } from '@aa/services/logger';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import Stripe from 'stripe';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

function getStripeCheckoutParams(options: {
  credits: number;
  email: string;
  url?: string;
  discount?: DiscountModel;
}) {
  let unit_amount = Math.round((options.credits / COIN_FACTOR) * 100);
  if (options.discount) {
    unit_amount = Math.round(
      unit_amount * (1 - options.discount.percent / 100),
    );
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: 'EUR',
        unit_amount,
        product_data: { name: `${options.credits} Credits` },
      },
      quantity: 1,
    },
  ];

  const params: Stripe.Checkout.SessionCreateParams = {
    mode: 'payment',
    submit_type: 'pay',
    payment_method_types: ['card'],
    customer_email: options.email,
    line_items: lineItems,
    success_url: `${options.url}/payment/accepted?checkoutSessionId={CHECKOUT_SESSION_ID}`,
    cancel_url: `${options.url}/payment/rejected`,
    metadata: { credits: options.credits },
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

    const discount = req.body.discountId
      ? discounts.find((discount) => {
          return discount.id === req.body.discountId;
        })
      : undefined;

    const stripeCheckoutParams = getStripeCheckoutParams({
      credits: req.body.credits,
      email: session.user.email,
      url: req.headers.origin,
      discount,
    });

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
