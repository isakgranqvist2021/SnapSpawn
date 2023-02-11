import mongodb from 'mongodb';

export interface TransactionDocument {
  _id: mongodb.BSON.ObjectId;
  createdAt: number;
  credits: number;
  email: string;
}

export type CreateTransactionDocument = Omit<TransactionDocument, '_id'>;

export interface CreateTransactionOptions {
  credits: number;
  email: string;
}
