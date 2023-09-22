import { deleteReferralById } from '@aa/database/referral';
import { Logger } from '@aa/services/logger';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

async function deleteReferral(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'DELETE') {
      res.setHeader('Allow', 'DELETE');
      return res.status(405).end('Method Not Allowed');
    }

    if (typeof req.query.id !== 'string') {
      throw new Error('Missing referral id');
    }

    const session = await getSession(req, res);
    if (!session?.user.email) {
      throw new Error('Cannot send referral while signed out');
    }

    const deleteReferralResult = await deleteReferralById({
      email: session.user.email,
      id: req.query.id,
    });
    if (deleteReferralResult instanceof Error) {
      throw deleteReferralResult;
    }

    return res.status(204).end();
  } catch (err) {
    Logger.log('error', err);
    return res.status(500).send({
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
}

export default withApiAuthRequired(deleteReferral);
