import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200);
  } catch {
    res.status(500);
  }
}

export default handler;
