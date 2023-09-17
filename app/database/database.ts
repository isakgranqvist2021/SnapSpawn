import { Logger } from '@aa/services/logger';
import clientPromise from '@aa/services/mongodb';
import { Document } from 'mongodb';

export async function getCollection<T extends Document>(
  collectionName: string,
) {
  try {
    const client = await clientPromise;
    const collection = client.db().collection<T>(collectionName);

    return collection;
  } catch (err) {
    Logger.log('error', err);
  }
}
