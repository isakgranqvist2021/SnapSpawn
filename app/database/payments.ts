import { Logger } from '@aa/services/logger';
import { ObjectId } from 'mongodb';

import { getCollection } from './database';

export interface PaymentDocument {
  _id: ObjectId;
  amount: number;
  checkoutSessionId: string;
  createdAt: number;
  credits: number;
  email: string;
}

export type CreatePaymentDocument = Omit<PaymentDocument, '_id'>;

export interface CreatePaymentDocumentOptions {
  amount: number;
  checkoutSessionId: string;
  credits: number;
  email: string;
}

export const PAYMENT_COLLECTION_NAME = 'payments';

export async function createPaymentDocument(
  options: CreatePaymentDocumentOptions,
) {
  try {
    const { amount, credits, email, checkoutSessionId } = options;

    const collection = await getCollection<CreatePaymentDocument>(
      PAYMENT_COLLECTION_NAME,
    );
    if (!collection) {
      return null;
    }

    await collection.createIndex({ email: 1, checkoutSessionId: 2 });

    const document: CreatePaymentDocument = {
      amount,
      createdAt: Date.now(),
      credits,
      email,
      checkoutSessionId,
    };

    const result = await collection.insertOne(document);

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export async function getPaymentDocumentByCheckoutSessionId(options: {
  checkoutSessionId: string;
}) {
  try {
    const { checkoutSessionId } = options;

    const collection = await getCollection<PaymentDocument>(
      PAYMENT_COLLECTION_NAME,
    );
    if (!collection) {
      return null;
    }

    const result = await collection.findOne({
      checkoutSessionId,
    });

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}
