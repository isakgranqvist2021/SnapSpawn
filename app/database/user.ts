import { Logger } from '@aa/services/logger';
import { ObjectId } from 'mongodb';

import { getCollection } from './database';

export interface UserDocument {
  _id: ObjectId;
  createdAt: number;
  credits: number;
  email: string;
}

export interface CreateUserDocument {
  createdAt: number;
  credits: number;
  email: string;
}

export const USERS_COLLECTION_NAME = 'users';

export async function getUser(options: { email: string }) {
  try {
    const { email } = options;

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

export async function createUser(options: { email: string }) {
  try {
    const { email } = options;

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
      credits: 0,
      createdAt: Date.now(),
    };

    const result = await collection.insertOne(document);

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export async function reduceUserCredits(options: {
  credits: number;
  email: string;
}) {
  try {
    const { email, credits } = options;

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

export async function increaseUserCredits(options: {
  credits: number;
  email: string;
}) {
  try {
    const { email, credits } = options;

    const collection = await getCollection<UserDocument>(USERS_COLLECTION_NAME);

    if (!collection) {
      Logger.log('error', 'Collection is null');
      return null;
    }

    const result = await collection.updateOne(
      { email },
      { $inc: { credits: credits } },
    );

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}
