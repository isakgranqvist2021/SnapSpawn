import { createReferral, referralAlreadyExists } from '@aa/database/referral';
import { userExists } from '@aa/database/user';
import { ReferralModel } from '@aa/models/referral';
import { Logger } from '@aa/services/logger';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

async function sendReferral(
  fromEmail: string,
  toEmail: string,
): Promise<ReferralModel | null> {
  try {
    const userExistsResult = await userExists({ email: toEmail });
    if (typeof userExistsResult !== 'boolean') {
      throw new Error('UserExistsResult is not boolean');
    } else if (userExistsResult) {
      throw new Error('User already exists');
    }

    const referralExistsResult = await referralAlreadyExists({
      fromEmail,
      toEmail,
    });
    if (typeof referralExistsResult !== 'boolean') {
      throw new Error('ReferralExistsResult is not boolean');
    } else if (referralExistsResult) {
      throw new Error('Referral already exists');
    }

    const res = await createReferral({ fromEmail, toEmail });
    if (!res) {
      throw new Error('cannot create referral');
    }

    // send email

    return {
      createdAt: res.createdAt,
      id: res._id.toHexString(),
      email: res.toEmail,
      status: res.status,
      creditsEarned: 0,
    };
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

async function referAFriend(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }

    req.body = JSON.parse(req.body);

    const session = await getSession(req, res);
    if (!session?.user.email) {
      throw new Error('cannot send referral user is null');
    }

    const sendReferralResult = await sendReferral(
      session.user.email,
      req.body.toEmail,
    );
    if (!sendReferralResult) {
      throw new Error('cannot send referral');
    }

    return res.status(200).json({ referral: sendReferralResult });
  } catch (err) {
    Logger.log('error', err);
    return res.status(500).send({ referral: null });
  }
}

export default withApiAuthRequired(referAFriend);
