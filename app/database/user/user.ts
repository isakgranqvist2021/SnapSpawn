import { Logger } from '@aa/services/logger';

import { getCollection } from '../database';
import { USERS_COLLECTION_NAME } from './user.constants';
import { CreateUserDocument, UserDocument } from './user.types';

export async function getUser(email: string) {
  try {
    const collection = await getCollection<UserDocument>(USERS_COLLECTION_NAME);

    if (!collection) {
      Logger.log('error', 'Collection is null');
      return null;
    }

    const user = await collection.findOne({ email });

    return user;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export async function createUser(email: string) {
  try {
    const collection = await getCollection<CreateUserDocument>(
      USERS_COLLECTION_NAME,
    );

    if (!collection) {
      Logger.log('error', 'Collection is null');
      return null;
    }

    await collection.createIndex({ email: 1 });

    const document: CreateUserDocument = {
      email,
      credits: 1,
      createdAt: Date.now(),
    };

    const result = await collection.insertOne(document);

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export async function reduceUserCredits(email: string, credits: number) {
  try {
    const collection = await getCollection<UserDocument>(USERS_COLLECTION_NAME);

    if (!collection) {
      Logger.log('error', 'Collection is null');
      return null;
    }

    const result = await collection.updateOne(
      { email },
      { $inc: { credits: -credits } },
    );

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}
