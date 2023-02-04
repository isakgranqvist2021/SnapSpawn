import { Logger } from '@aa/services/logger';
import clientPromise from '@aa/services/mongodb';
import mongodb from 'mongodb';

const COLLECTION_NAME = 'avatars';

export interface AvatarDocument {
  _id: mongodb.BSON.ObjectId;
  email: string;
  avatar: string;
  prompt: string;
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

export async function getAvatars(
  email: string,
): Promise<AvatarDocument[] | null> {
  try {
    const collection = await getCollection<AvatarDocument>();

    if (!collection) {
      return null;
    }

    const result = await collection
      .find({ email })
      .sort({ createdAt: -1 })
      .toArray();

    return result.map((avatarDocument) => {
      const document: AvatarDocument = {
        _id: avatarDocument._id,
        avatar: avatarDocument.avatar,
        prompt: avatarDocument.prompt,
        email: avatarDocument.email,
        createdAt: avatarDocument.createdAt,
      };

      return document;
    });
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export async function createAvatars(
  email: string,
  avatars: string[],
  prompt: string,
) {
  try {
    const collection = await getCollection<Omit<AvatarDocument, '_id'>>();

    if (!collection) {
      return null;
    }

    const documents = avatars.map((avatar) => {
      const document: Omit<AvatarDocument, '_id'> = {
        email,
        avatar,
        prompt,
        createdAt: Date.now(),
      };

      return document;
    });

    const result = await collection.insertMany(documents);

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}
