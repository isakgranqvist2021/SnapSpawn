import { createAvatars } from '@aa/prisma/avatar';
import { reduceUserCredits } from '@aa/prisma/user';
import generateAvatars from '@aa/services/avatar';
import getPrompt, { PromptOptions } from '@aa/utils/prompt';
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

    const prompt = getPrompt(body);

    const urls = await generateAvatars(prompt);

    await createAvatars(session.user.email, urls);
    await reduceUserCredits(session.user.email, urls.length);

    res.status(200).json({ urls });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
}

export default handler;
