import { Logger } from '@aa/services/logger';
import { ObjectId } from 'mongodb';

import { getCollection } from './database';

export interface TransactionDocument {
  _id: ObjectId;
  createdAt: number;
  credits: number;
  email: string;
}

export type CreateTransactionDocument = Omit<TransactionDocument, '_id'>;

export interface CreateTransactionOptions {
  credits: number;
  email: string;
}

export const TRANSACTION_COLLECTION_NAME = 'transactions';

export async function createTransaction(options: CreateTransactionOptions) {
  try {
    const { credits, email } = options;

    const collection = await getCollection<CreateTransactionDocument>(
      TRANSACTION_COLLECTION_NAME,
    );

    if (!collection) {
      return null;
    }

    await collection.createIndex({ email: 1 });

    const document: CreateTransactionDocument = {
      createdAt: Date.now(),
      credits,
      email,
    };

    const result = await collection.insertOne(document);

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}
