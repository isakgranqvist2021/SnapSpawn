import generateAvatars from '@aa/services/avatar';
import getPrompt from '@aa/utils/prompt';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Data {
  urls: string[];
}

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const prompt = getPrompt({
      gender: 'male',
      age: 25,
      characteristics: 'nerdy',
    });

    const urls = await generateAvatars(prompt);

    res.status(200).json({ urls });
  } catch {
    res.status(500);
  }
}

export default handler;
