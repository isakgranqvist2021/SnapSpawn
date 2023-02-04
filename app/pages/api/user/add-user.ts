import { createUser } from '@aa/database/user';
import type { NextApiRequest, NextApiResponse } from 'next';

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    if (!emailRegexp.test(req.body.email)) {
      return res.status(400).send('invalid email');
    }

    await createUser(req.body.email);

    return res.status(200).send('ok');
  } catch (err) {
    return res.status(500).send('internal server error');
  }
}

export default handler;
