import { Logger } from '@aa/services/logger';
import { handleAuth } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

function onError(req: NextApiRequest, res: NextApiResponse, error: Error) {
  Logger.log('error', error.message, { req, res, error });
}

export default handleAuth({
  onError,
});
