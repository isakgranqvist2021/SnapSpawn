import { createUser } from '@aa/prisma/user';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const body = JSON.parse(req.body);
    const email = body.email;

    await createUser(email);

    return res.status(200).send('ok');
  } catch (err) {
    return res.status(500).send('internal server error');
  }
}

export default handler;
