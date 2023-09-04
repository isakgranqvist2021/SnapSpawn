import { Characteristic, Gender, Traits } from '@aa/models/prompt';
import { Logger } from '@aa/services/logger';
import mongodb, { ObjectId } from 'mongodb';

import { getCollection } from './database';

export interface PromptOptions {
  characteristics: Characteristic | null;
  custom: boolean;
  gender: Gender | null;
  traits: Traits | null;
}

export interface AvatarDocument {
  _id: mongodb.BSON.ObjectId;
  avatar: string;
  createdAt: number;
  email: string;
  parentId: mongodb.BSON.ObjectId | null;
  prompt: string;
  promptOptions: PromptOptions;
}

export type CreateAvatarDocument = Omit<AvatarDocument, '_id'>;

export interface CreateAvatarsOptions {
  avatars: string[];
  email: string;
  parentId: mongodb.BSON.ObjectId | null;
  prompt: string;
  promptOptions: PromptOptions;
}

export const AVATARS_COLLECTION_NAME = 'avatars';

export async function getAvatars(options: { email: string }) {
  try {
    const { email } = options;

    const collection = await getCollection<AvatarDocument>(
      AVATARS_COLLECTION_NAME,
    );

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
        createdAt: avatarDocument.createdAt,
        email: avatarDocument.email,
        prompt: avatarDocument.prompt,
        promptOptions: avatarDocument.promptOptions,
        parentId: avatarDocument.parentId,
      };

      return document;
    });
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export async function getAvatar(options: { id: string }) {
  try {
    const { id } = options;

    const collection = await getCollection<AvatarDocument>(
      AVATARS_COLLECTION_NAME,
    );

    if (!collection) {
      return null;
    }

    const result = await collection.findOne({ _id: new ObjectId(id) });

    if (!result) {
      return null;
    }

    const document: AvatarDocument = {
      _id: result._id,
      avatar: result.avatar,
      createdAt: result.createdAt,
      email: result.email,
      prompt: result.prompt,
      promptOptions: result.promptOptions,
      parentId: result.parentId,
    };

    return document;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export async function createAvatars(options: CreateAvatarsOptions) {
  try {
    const { avatars, email, prompt, promptOptions, parentId } = options;

    const collection = await getCollection<CreateAvatarDocument>(
      AVATARS_COLLECTION_NAME,
    );

    if (!collection) {
      return null;
    }

    const documents = avatars.map((avatar) => {
      const document: CreateAvatarDocument = {
        avatar,
        createdAt: Date.now(),
        email,
        prompt,
        promptOptions,
        parentId,
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
