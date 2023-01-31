import { buffer } from 'micro';
import Cors from 'micro-cors';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = { api: { bodyParser: false } };

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature']!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
  } catch (err) {
    console.log(err);

    res.json({ received: true });
    return;
  }

  console.log('✅ Success:', event.id);

  if (event.type === 'payment_intent.succeeded') {
    res.json({ received: true });
    return;
  }

  if (event.type === 'payment_intent.payment_failed') {
    res.json({ received: true });
    return;
  }

  if (event.type === 'charge.succeeded') {
    res.json({ received: true });
    return;
  }

  res.json({ received: true });
}

export default Cors({
  allowMethods: ['POST', 'HEAD'],
})(handler as any);
