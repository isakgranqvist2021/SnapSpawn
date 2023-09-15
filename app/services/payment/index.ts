import { STRIPE_SECRET_KEY } from '@aa/config';
import { getCollection } from '@aa/database/database';
import {
  createPaymentDocument,
  getPaymentDocumentByCheckoutSessionId,
} from '@aa/database/payments';
import { USERS_COLLECTION_NAME, UserDocument } from '@aa/database/user';
import Stripe from 'stripe';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export async function verifyAndCompletePayment(
  checkoutSessionId: string,
): Promise<Error | null> {
  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(
      checkoutSessionId,
    );

    const paymentDocument = await getPaymentDocumentByCheckoutSessionId({
      checkoutSessionId,
    });
    if (paymentDocument) {
      throw new Error('Payment already completed');
    }

    if (checkoutSession.payment_status !== 'paid') {
      throw new Error('Payment not completed');
    }

    const credits = parseInt(checkoutSession.metadata?.credits ?? '0');
    if (!credits) {
      throw new Error('Credits is null');
    }

    const email = checkoutSession.customer_email;
    if (!email) {
      throw new Error('Email is null');
    }

    const collection = await getCollection<UserDocument>(USERS_COLLECTION_NAME);
    if (!collection) {
      throw new Error('Collection is null');
    }

    const updateResult = await collection.updateOne(
      { email },
      { $inc: { credits } },
    );
    if (updateResult?.modifiedCount !== 1) {
      throw new Error('Charge successful, but user not found');
    }

    const createPaymentDocumentResult = await createPaymentDocument({
      checkoutSessionId,
      email,
      credits,
      amount: checkoutSession.amount_total ?? 0,
    });
    if (!createPaymentDocumentResult?.acknowledged) {
      throw new Error('Payment document not created');
    }

    return null;
  } catch (err) {
    return err instanceof Error ? err : new Error('Unknown error');
  }
}
