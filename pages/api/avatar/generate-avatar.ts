import { createAvatars } from '@aa/prisma/avatar';
import { getUser, reduceUserCredits } from '@aa/prisma/user';
import { generateAvatars } from '@aa/services/avatar';
import { uploadAvatar } from '@aa/services/gcp';
import { PromptOptions, getPrompt } from '@aa/utils/prompt';
import { getSession } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Data {
  urls: string[];
}

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const body: PromptOptions = JSON.parse(req.body);

    const session = await getSession(req, res);

    if (!session?.user.email) {
      throw new Error('cannot generate avatar while logged out');
    }

    const user = await getUser(session.user.email);

    if (!user) {
      throw new Error('cannot generate avatar for non-existent user');
    }

    if (user.credits < 1) {
      throw new Error('cannot generate avatar without credits');
    }

    const prompt = getPrompt(body);

    const urls = await generateAvatars(prompt);
    const avatarIds = await uploadAvatar(urls);

    await createAvatars(session.user.email, avatarIds);
    await reduceUserCredits(session.user.email, urls.length);

    return res.status(200).json({ urls });
  } catch (err) {
    return res.status(500).send({ urls: [] });
  }
}

export default handler;
