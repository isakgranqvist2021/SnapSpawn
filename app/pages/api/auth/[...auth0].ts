import { getReferral } from '@aa/database/referral';
import { Logger } from '@aa/services/logger';
import { handleAuth, handleCallback, handleLogin } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

function onError(req: NextApiRequest, res: NextApiResponse, error: Error) {
  Logger.log('error', error.message, { req, res, error });
}

async function callback(req: NextApiRequest, res: NextApiResponse) {
  try {
    await handleCallback(req, res, {
      afterCallback: (req, res, session) => {
        return session;
      },
    });
  } catch (err) {
    Logger.log('error', err);

    if (err instanceof Error) {
      return res.redirect('/account');
    }

    return res.redirect('/account');
  }
}

async function login(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (typeof req.query.referral !== 'string') {
      await handleLogin(req, res, { returnTo: '/account' });

      return;
    }

    const referral = await getReferral({
      id: req.query.referral,
    });
    if (!referral) {
      return res.redirect('/error');
    }

    await handleLogin(req, res, {
      returnTo: `/account?referral=${req.query.referral}`,
    });
  } catch (err) {
    Logger.log('error', err);
    return res.redirect('/api/auth/logout');
  }
}

export default handleAuth({
  onError,
  callback,
  login,
});
