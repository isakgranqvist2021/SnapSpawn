import { NODE_ENV } from '@aa/config';
import { createAvatars } from '@aa/database/avatar';
import { generateAvatars } from '@aa/services/avatar';
import { uploadAvatar } from '@aa/services/gcp';
import { createQueryUrlFromObject } from '@aa/utils';
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

  const urls = await generateAvatars(req.body.prompt, '256x256', 5);

  if (!urls) {
    return res.status(500).send('Internal Server Error');
  }

  const avatarIds = await uploadAvatar(urls);

  await createAvatars({
    email: 'contact@granqvist.dev',
    avatars: avatarIds,
    prompt: createQueryUrlFromObject(req.body),
  });

  if (!urls) {
    return res.status(500).send('Internal Server Error');
  }

  return res.status(200).json({ urls });
}
