import mongodb from 'mongodb';

export interface AvatarDocument {
  _id: mongodb.BSON.ObjectId;
  avatar: string;
  createdAt: number;
  email: string;
  prompt: string;
}
