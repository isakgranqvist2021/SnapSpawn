import mongodb from 'mongodb';

export interface AvatarDocument {
  _id: mongodb.BSON.ObjectId;
  avatar: string;
  createdAt: number;
  email: string;
  prompt: string;
}

export type CreateAvatarDocument = Omit<AvatarDocument, '_id'>;

export interface GetAvatarsOptions {
  email: string;
}

export interface CreateAvatarsOptions {
  avatars: string[];
  email: string;
  prompt: string;
}
