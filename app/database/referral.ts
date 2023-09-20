import { Logger } from '@aa/services/logger';
import { ObjectId } from 'mongodb';

import { getCollection } from './database';

export interface ReferralDocument {
  _id: ObjectId;
  createdAt: number;
  fromEmail: string;
  status: 'pending' | 'success' | 'failure';
  toEmail: string;
}

export type CreateReferralDocument = Omit<ReferralDocument, '_id'>;

export const REFERRAL_COLLECTION_NAME = 'referral';

export async function createReferral(options: {
  fromEmail: string;
  toEmail: string;
}): Promise<ReferralDocument | null> {
  try {
    const { fromEmail, toEmail } = options;

    const collection = await getCollection<CreateReferralDocument>(
      REFERRAL_COLLECTION_NAME,
    );
    if (!collection) {
      throw new Error('Collection is null');
    }

    await collection.createIndex({ fromEmail: 1, toEmail: 2 });

    const document: CreateReferralDocument = {
      createdAt: Date.now(),
      fromEmail,
      status: 'pending',
      toEmail,
    };

    const result = await collection.insertOne(document);
    if (!result.acknowledged) {
      throw new Error('Failed to insert referral');
    }

    return {
      _id: result.insertedId,
      createdAt: document.createdAt,
      status: 'pending',
      toEmail,
      fromEmail,
    };
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export async function referralByFromEmailAndToEmail(options: {
  fromEmail: string;
  toEmail: string;
}) {
  try {
    const { fromEmail, toEmail } = options;

    const collection = await getCollection<ReferralDocument>(
      REFERRAL_COLLECTION_NAME,
    );
    if (!collection) {
      return null;
    }

    const result = await collection.findOne({ fromEmail, toEmail });

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export async function getCompletedReferralByToEmail(options: {
  toEmail: string;
}) {
  try {
    const { toEmail } = options;

    const collection = await getCollection<ReferralDocument>(
      REFERRAL_COLLECTION_NAME,
    );
    if (!collection) {
      return null;
    }

    const result = await collection.findOne({ toEmail, status: 'success' });

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export async function getReferral(options: { id: string }) {
  try {
    const { id } = options;

    const collection = await getCollection<ReferralDocument>(
      REFERRAL_COLLECTION_NAME,
    );
    if (!collection) {
      return null;
    }

    const result = await collection.findOne({ _id: new ObjectId(id) });

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export async function getReferrals(options: { fromEmail: string }) {
  try {
    const { fromEmail } = options;

    const collection = await getCollection<ReferralDocument>(
      REFERRAL_COLLECTION_NAME,
    );
    if (!collection) {
      return null;
    }

    const result = await collection.find({ fromEmail }).toArray();

    return result;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export async function completeReferral(options: {
  referral: string;
  toEmail: string;
}) {
  try {
    const { referral, toEmail } = options;

    const collection = await getCollection<ReferralDocument>(
      REFERRAL_COLLECTION_NAME,
    );
    if (!collection) {
      return null;
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(referral), toEmail, status: 'pending' },
      {
        $set: {
          status: 'success',
        },
      },
    );
    if (!result.modifiedCount) {
      throw new Error('Failed to update referral');
    }

    return true;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}
