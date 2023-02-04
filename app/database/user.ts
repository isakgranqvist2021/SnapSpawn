import { Logger } from '@aa/services/logger';
import clientPromise from '@aa/services/mongodb';
import mongodb from 'mongodb';

const COLLECTION_NAME = 'users';

export interface UserDocument {
  _id: mongodb.ObjectId;
  email: string;
  credits: number;
  createdAt: number;
}

async function getCollection<T extends mongodb.Document>() {
  try {
    const client = await clientPromise;
    const collection = client.db().collection<T>(COLLECTION_NAME);

    return collection;
  } catch (err) {
    Logger.log('error', err);
  }
}

export async function getUser(email: string) {
  try {
    const collection = await getCollection<UserDocument>();

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
    const collection = await getCollection<Omit<UserDocument, '_id'>>();

    if (!collection) {
      Logger.log('error', 'Collection is null');
      return null;
    }

    await collection.createIndex({ email: 1 });

    const document: Omit<UserDocument, '_id'> = {
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

export async function reduceUserCredits(email: string, credits: number) {
  try {
    const collection = await getCollection<UserDocument>();

    if (!collection) {
      Logger.log('error', 'Collection is null');
      return null;
    }

    const result = await collection.updateOne({ email }, { $inc: { credits } });

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}
