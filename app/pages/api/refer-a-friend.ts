import { AUTH0_BASE_URL } from '@aa/config';
import {
  createReferral,
  referralByFromEmailAndToEmail,
} from '@aa/database/referral';
import { getUser } from '@aa/database/user';
import { ReferralModel } from '@aa/models/referral';
import { Logger } from '@aa/services/logger';
import { sendEmail } from '@aa/services/nodemailer';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

async function sendReferral(
  fromEmail: string,
  toEmail: string,
): Promise<ReferralModel | Error> {
  try {
    const user = await getUser({ email: toEmail });
    if (user) {
      throw new Error('User already exists');
    }

    const referral = await referralByFromEmailAndToEmail({
      fromEmail,
      toEmail,
    });
    if (referral) {
      throw new Error('Referral already exists');
    }

    const res = await createReferral({ fromEmail, toEmail });
    if (!res) {
      throw new Error("You've already sent a referral to this email");
    }

    await sendEmail(
      res.toEmail,
      'You have a referral!',
      `${AUTH0_BASE_URL}/api/auth/login?referralId=${res._id}`,
    );

    return {
      createdAt: res.createdAt,
      id: res._id.toHexString(),
      email: res.toEmail,
      status: res.status,
      creditsEarned: 0,
    };
  } catch (err) {
    Logger.log('error', err);
    return err instanceof Error ? err : new Error('Unknown error');
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
      throw new Error('Cannot send referral while signed out');
    }

    const sendReferralResult = await sendReferral(
      session.user.email,
      req.body.toEmail,
    );
    if (sendReferralResult instanceof Error) {
      throw sendReferralResult;
    }

    return res.status(200).json({ referral: sendReferralResult });
  } catch (err) {
    Logger.log('error', err);
    return res.status(500).send({
      referral: null,
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

export default withApiAuthRequired(referAFriend);
