import { Logger } from '@aa/services/logger';
import { Session, handleAuth, handleCallback } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

function onError(req: NextApiRequest, res: NextApiResponse, error: Error) {
  Logger.log('error', error.message, { req, res, error });
}

async function afterCallback(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
) {
  Logger.log('info', 'afterCallback', { session });
  return session;
}

async function callback(req: NextApiRequest, res: NextApiResponse) {
  try {
    await handleCallback(req, res, {
      afterCallback,
    });
  } catch (err) {
    Logger.log('error', err);

    if (err instanceof Error) {
      return res.redirect('/account');
    }

    return res.redirect('/account');
  }
}

export default handleAuth({
  onError,
  callback,
});
