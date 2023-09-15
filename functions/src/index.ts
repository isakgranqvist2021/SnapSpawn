import 'dotenv/config';
import type { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

const mongoClient = new MongoClient(process.env.MONGO_DB_DATABASE_URL!);

function logAndSend(res: Response, status: number, message: string) {
  console.log(message);
  return res.status(status).send(message);
}

async function handleEvent(req: Request, res: Response) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return logAndSend(res, 405, 'Method Not Allowed');
    }

    if (!req.headers['stripe-signature']) {
      return logAndSend(res, 400, 'Webhook Error: stripe-signature is null');
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
    if (!event) {
      return logAndSend(res, 400, 'Webhook Error: event is null');
    }

    if (event.type === 'payment_intent.succeeded') {
      return logAndSend(res, 202, 'Webhook received: PaymentIntent successful');
    }

    if (event.type === 'payment_intent.payment_failed') {
      return logAndSend(res, 400, 'Webhook received: PaymentIntent failed');
    }

    if (event.type === 'charge.succeeded') {
      const eventData = event.data.object as Stripe.Charge;
      if (!eventData.payment_intent) {
        return logAndSend(res, 400, 'Webhook Error: paymentIntent is null');
      }

      const paymentIntentId =
        typeof eventData.payment_intent === 'string'
          ? eventData.payment_intent
          : eventData.payment_intent.id;

      const [checkoutSessionData] = await stripe.checkout.sessions
        .list({
          payment_intent: paymentIntentId,
        })
        .then((sessions) => sessions.data);

      const credits =
        checkoutSessionData.metadata?.credits ?? eventData.amount_captured / 5;
      if (!credits) {
        return logAndSend(res, 400, 'Webhook Error: credits is null');
      }

      const email = checkoutSessionData.customer_email;
      if (!email) {
        return logAndSend(res, 400, 'Webhook Error: email is null');
      }

      const client = await mongoClient.connect();
      if (!client) {
        throw new Error('MongoClient is null');
      }

      const collection = client.db().collection('users');
      if (!collection) {
        throw new Error('Collection is null');
      }

      const updateResult = await collection.updateOne(
        { email },
        {
          $inc: {
            credits: typeof credits === 'string' ? parseInt(credits) : credits,
          },
        },
      );
      if (updateResult?.modifiedCount !== 1) {
        return logAndSend(
          res,
          400,
          'Webhook received: Charge successful, but user not found',
        );
      }

      return logAndSend(res, 201, 'Webhook received: Charge successful');
    }

    return logAndSend(res, 400, 'Webhook Error: Unhandled event');
  } catch (err) {
    console.error(err);
    return logAndSend(res, 500, 'Webhook Error: Unhandled error');
  }
}

export default (req: Request & { rawBody: any }, res: Response) => {
  req.body = req.rawBody;

  return handleEvent(req, res);
};
