import { Request, Response } from 'express';
import { buffer } from 'micro';
import { MongoClient } from 'mongodb';
import Stripe from 'stripe';

const client = new MongoClient(process.env.DATABASE_URL!);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

async function addUserCredits(email: string, credits: number) {
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('users');

    return await collection.updateOne({ email }, { $inc: { credits } });
  } catch (err) {
    return null;
  }
}

function stripeAmountToCredits(stripeAmount: number) {
  if (stripeAmount === 100) {
    return 10;
  }

  if (stripeAmount === 450) {
    return 50;
  }

  return 100;
}

function getWebhookEvent(
  buffer: Buffer,
  signature: string | string[] | undefined,
) {
  if (!signature) {
    return null;
  }

  try {
    const event = stripe.webhooks.constructEvent(
      buffer.toString(),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    return event;
  } catch (err) {
    return null;
  }
}

export default async function (req: Request, res: Response) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const buf = await buffer(req);
  const event = getWebhookEvent(buf, req.headers['stripe-signature']);

  if (!event) {
    return res.status(400).send('Webhook Error: event is null');
  }

  if (event.type === 'payment_intent.succeeded') {
    return res.status(202).send('Webhook received: PaymentIntent successful');
  }

  if (event.type === 'payment_intent.payment_failed') {
    return res.status(400).send('Webhook received: PaymentIntent failed');
  }

  if (event.type === 'charge.succeeded') {
    const paymentIntent = event.data.object as any;

    const credits = stripeAmountToCredits(paymentIntent.amount_captured);
    const email: string = paymentIntent.billing_details.email;

    await addUserCredits(email, credits);

    return res.status(201).send('Webhook received: Charge successful');
  }

  return res.status(204).send('Webhook received: Unhandled event');
}
