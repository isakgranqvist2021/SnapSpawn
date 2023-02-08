import { Logger } from '@aa/services/logger';
import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

function onError(req: NextApiRequest, res: NextApiResponse, error: Error) {
  Logger.log('error', error.message, { req, res, error });
}

async function callback(req: NextApiRequest, res: NextApiResponse) {
  try {
    await handleCallback(req, res, {
      afterCallback: async (req, res, session) => {
        Logger.log('info', 'afterCallback', { req, res, session });
        return session;
      },
    });
  } catch (err) {
    Logger.log('error', err, { req, res, err });
  }
}

export default handleAuth({
  onError,
  callback,
});
