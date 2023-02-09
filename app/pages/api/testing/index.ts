import { NODE_ENV } from '@aa/config';
import { generateAvatars } from '@aa/services/avatar';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  if (NODE_ENV === 'production') {
    return res.status(404).send('Not Found');
  }

  req.body = JSON.parse(req.body);

  const urls = await generateAvatars(req.body.prompt, '512x512', 1);

  if (!urls) {
    return res.status(500).send('Internal Server Error');
  }

  return res.status(200).json({ urls });
}
