import mongodb from 'mongodb';

export interface UserDocument {
  _id: mongodb.ObjectId;
  createdAt: number;
  credits: number;
  email: string;
}

export interface CreateUserDocument {
  createdAt: number;
  credits: number;
  email: string;
}

export interface ReduceUserCreditsOptions {
  credits: number;
  email: string;
}

export interface CreateUserOptions {
  email: string;
}

export interface GetUserOptions {
  email: string;
}
