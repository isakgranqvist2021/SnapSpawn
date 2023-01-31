import { getSession } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

interface BuyCreditBody {
  credits: number;
}

async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  try {
    const body: BuyCreditBody = JSON.parse(req.body);

    const session = await getSession(req, res);

    if (!session?.user.email) {
      throw new Error('cannot  buy credits while logged out');
    }

    console.log({ credits: body.credits, email: session.user.email });

    return res.status(200).send('ok');
  } catch (err) {
    return res.status(500).send('internal server error');
  }
}

export default handler;
