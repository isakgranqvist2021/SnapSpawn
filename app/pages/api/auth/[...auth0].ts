import { Logger } from '@aa/services/logger';
import { handleAuth } from '@auth0/nextjs-auth0';

export default handleAuth({
  onError: (req, res, err) => {
    Logger.log('info', req.url);
    Logger.log('info', req.body);
    Logger.log('info', req.headers);
    Logger.log('error', err);
  },
});
