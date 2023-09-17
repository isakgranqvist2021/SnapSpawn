<<<<<<< Updated upstream
=======
import { AvatarModel } from '@aa/models/avatar';
import { PaginateReturn } from '@aa/models/paginate';
import { Characteristic, Gender, Traits } from '@aa/models/prompt';
>>>>>>> Stashed changes
import { Logger } from '@aa/services/logger';
import mongodb from 'mongodb';

import { getCollection } from './database';

export type PromptOptions = Record<string, any> | null;

export interface AvatarDocument {
  _id: mongodb.BSON.ObjectId;
  avatar: string;
  createdAt: number;
  email: string;
  prompt: string;
  promptOptions: PromptOptions;
}

export type CreateAvatarDocument = Omit<AvatarDocument, '_id'>;

export interface GetAvatarsOptions {
  email: string;
}

export interface CreateAvatarsOptions {
  avatars: string[];
  email: string;
  prompt: string;
  promptOptions: PromptOptions;
}

export const AVATARS_COLLECTION_NAME = 'avatars';

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
        promptOptions: avatarDocument.promptOptions,
      };

      return document;
    });
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

<<<<<<< Updated upstream
=======
export async function paginateAvatars(options: {
  email: string;
  page: number;
  limit: number;
}): Promise<PaginateReturn<AvatarDocument>> {
  const { email, page, limit } = options;

  try {
    const collection = await getCollection<AvatarDocument>(
      AVATARS_COLLECTION_NAME,
    );

    if (!collection) {
      return {
        data: [],
        totalCount: 0,
        pageCount: 0,
        currentPage: 0,
        pageSize: 0,
      };
    }

    const totalCount = await collection.countDocuments({ email });

    const result = await collection
      .find({ email })
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();

    const data = result.map((avatarDocument) => {
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

    return {
      data,
      totalCount,
      pageCount: Math.ceil(totalCount / limit),
      currentPage: page,
      pageSize: limit,
    };
  } catch (err) {
    Logger.log('error', err);
    return {
      data: [],
      totalCount: 0,
      pageCount: 0,
      currentPage: 0,
      pageSize: 0,
    };
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

>>>>>>> Stashed changes
export async function createAvatars(options: CreateAvatarsOptions) {
  try {
    const { avatars, email, prompt, promptOptions } = options;

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
