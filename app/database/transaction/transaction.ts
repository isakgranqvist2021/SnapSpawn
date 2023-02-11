import { Logger } from '@aa/services/logger';

import { getCollection } from '../database';
import { TRANSACTION_COLLECTION_NAME } from './transaction.constants';
import {
  CreateTransactionDocument,
  CreateTransactionOptions,
} from './transaction.types';

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

    console.log(result);

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}
