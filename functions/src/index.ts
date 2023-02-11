import type { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import Stripe from 'stripe';
import 'dotenv/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

if (!stripe) {
  throw new Error('Stripe is null');
}

const amountMap = new Map([
  [100, 10],
  [450, 50],
  [800, 100],
]);

async function addUserCredits(email: string, credits: number) {
  try {
    const client = await new MongoClient(
      process.env.MONGO_DB_DATABASE_URL!,
    ).connect();

    if (!client) {
      throw new Error('MongoClient is null');
    }

    const collection = client.db().collection('users');

    if (!collection) {
      throw new Error('Collection is null');
    }

    return await collection.updateOne({ email }, { $inc: { credits } });
  } catch (err) {
    console.error(err);
    return null;
  }
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
    console.error(err);
    return null;
  }
}

async function handleEvent(req: Request, res: Response) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
      return;
    }

    const event = getWebhookEvent(req.body, req.headers['stripe-signature']);

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

      if (!paymentIntent) {
        return res
          .status(400)
          .send(
            'Webhook received: Charge successful, but paymentIntent is null',
          );
      }

      const credits = amountMap.get(paymentIntent.amount_captured);

      if (!credits) {
        return res
          .status(400)
          .send('Webhook received: Charge successful, but credits is null');
      }

      const email: string = paymentIntent.billing_details.email;

      if (!email) {
        return res
          .status(400)
          .send('Webhook received: Charge successful, but email is null');
      }

      const updateResult = await addUserCredits(email, credits);

      if (updateResult?.modifiedCount === 1) {
        return res.status(201).send('Webhook received: Charge successful');
      }

      return res
        .status(400)
        .send('Webhook received: Charge successful, but user not found');
    }

    return res.status(204).send('Webhook received: Unhandled event');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Webhook Error: Unhandled error');
  }
}

export default function (req: Request & { rawBody: any }, res: Response) {
  req.body = req.rawBody;
  return handleEvent(req, res);
}
