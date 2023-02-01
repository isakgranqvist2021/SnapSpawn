import { env } from '@aa/config';
import { addUserCredits } from '@aa/prisma/user';
import { Logger } from '@aa/services/logger';
import { stripeAmountToCredits } from '@aa/utils/credits';
import { getSession } from '@auth0/nextjs-auth0';
import { buffer } from 'micro';
import Cors from 'micro-cors';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export const config = { api: { bodyParser: false } };

function getWebhookEvent(
  buffer: Buffer,
  signature: string | string[] | undefined,
) {
  if (!signature) {
    Logger.log('error', 'No signature');
    return null;
  }

  try {
    const event = stripe.webhooks.constructEvent(
      buffer.toString(),
      signature,
      env.webhookSecret,
    );

    return event;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const buf = await buffer(req);
  const event = getWebhookEvent(buf, req.headers['stripe-signature']);

  if (!event) {
    res.status(400).send('Webhook Error: event is null');
    return;
  }

  if (event.type === 'payment_intent.succeeded') {
    Logger.log('info', {
      message: 'PaymentIntent successful',
      paymentIntent: event.data.object,
    });
    return res.status(202).send('Webhook received: PaymentIntent successful');
  }

  if (event.type === 'payment_intent.payment_failed') {
    Logger.log('info', {
      message: 'PaymentIntent failed',
      paymentIntent: event.data.object,
    });
    return res.status(400).send('Webhook received: PaymentIntent failed');
  }

  if (event.type === 'charge.succeeded') {
    Logger.log('info', {
      message: 'Charge successful',
      paymentIntent: event.data.object,
    });

    const paymentIntent = event.data.object as any;

    const credits = stripeAmountToCredits(paymentIntent.amount_captured);
    const email: string = paymentIntent.billing_details.email;

    await addUserCredits(email, credits);

    return res.status(201).send('Webhook received: Charge successful');
  }

  Logger.log('warning', {
    message: 'Unhandled event',
    paymentIntent: event.data.object,
  });
  return res.status(404).send('Webhook received: Unhandled event');
}

export default Cors({
  allowMethods: ['POST', 'HEAD'],
})(handler as any);
