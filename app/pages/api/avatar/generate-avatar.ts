import { createAvatars } from '@aa/database/avatar';
import { getUser, reduceUserCredits } from '@aa/database/user';
import { AvatarModel } from '@aa/models';
import { PromptModel } from '@aa/models/prompt.model';
import { generateAvatars } from '@aa/services/avatar';
import { getSignedUrl, uploadAvatar } from '@aa/services/gcp';
import { Logger } from '@aa/services/logger';
import { getSession } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Data {
  avatars: AvatarModel[];
}

export function getPrompt(options: PromptModel) {
  const { age, characteristics, gender, traits } = options;

  const parts = [
    'Can you give me',
    gender === 'rather not say' ? 'an avatar' : `a ${gender} avatar`,
    `who is ${age} old`,
    `and is wearing ${traits}`,
    `and has this characteristics: ${characteristics}`,
  ];

  return parts.join(' ');
}

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const body: PromptModel = JSON.parse(req.body);

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

    const openAiUrls = await generateAvatars(prompt);
    const avatarIds = await uploadAvatar(openAiUrls);

    await createAvatars(
      session.user.email,
      avatarIds,
      Object.keys(body)
        .map((key) => `${key}=${body[key as keyof PromptModel]}`)
        .join('&'),
    );

    await reduceUserCredits(session.user.email, openAiUrls.length);

    const avatarModels: AvatarModel[] = await Promise.all(
      avatarIds.map(async (avatarId): Promise<AvatarModel> => {
        const url = await getSignedUrl(avatarId);

        return {
          url: url,
          id: avatarId,
          createdAt: Date.now(),
          prompt,
        };
      }),
    );

    return res.status(200).json({ avatars: avatarModels });
  } catch (err) {
    Logger.log('error', err);
    return res.status(500).send({ avatars: [] });
  }
}

export default handler;
