import { Logger } from '@aa/services/logger';

import { getCollection } from '../database';
import { AVATARS_COLLECTION_NAME } from './avatar.constants';
import {
  AvatarDocument,
  CreateAvatarDocument,
  CreateAvatarsOptions,
  GetAvatarsOptions,
} from './avatar.types';

export async function getAvatars(options: GetAvatarsOptions) {
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
      };

      return document;
    });
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export async function createAvatars(options: CreateAvatarsOptions) {
  try {
    const { avatars, email, prompt } = options;

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
