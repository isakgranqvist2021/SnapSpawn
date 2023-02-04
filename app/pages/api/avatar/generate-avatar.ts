import { createAvatars } from '@aa/database/avatar';
import { getUser, reduceUserCredits } from '@aa/database/user';
import { AvatarModel } from '@aa/models';
import { PromptModel } from '@aa/models/prompt.model';
import { generateAvatars } from '@aa/services/avatar';
import { getSignedUrl, uploadAvatar } from '@aa/services/gcp';
import { Logger } from '@aa/services/logger';
import { Session, getSession } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Data {
  avatars: AvatarModel[];
}

function getPrompt(promptModel: PromptModel) {
  const { age, characteristics, gender, traits } = promptModel;

  const parts = [
    'Can you give me',
    gender === 'rather not say' ? 'an avatar' : `a ${gender} avatar`,
    `who is ${age} old`,
    `and is wearing ${traits}`,
    `and has this characteristics: ${characteristics}`,
  ];

  return parts.join(' ');
}

async function getAvatarModels(promptModel: PromptModel, email: string) {
  try {
    const prompt = getPrompt(promptModel);
    const openAiUrls = await generateAvatars(prompt);
    const avatarIds = await uploadAvatar(openAiUrls);

    const query = Object.keys(promptModel)
      .map((key) => `${key}=${promptModel[key as keyof PromptModel]}`)
      .join('&');

    await createAvatars(email, avatarIds, query);
    await reduceUserCredits(email, openAiUrls.length);

    return Promise.all(
      avatarIds.map(async (avatarId): Promise<AvatarModel> => {
        const url = await getSignedUrl(avatarId);

        return {
          createdAt: Date.now(),
          id: avatarId,
          prompt,
          url,
        };
      }),
    );
  } catch {
    return null;
  }
}

async function getUserAndValidateCredits(session?: Session | null) {
  try {
    if (!session?.user.email) {
      throw new Error('cannot generate avatar while logged out');
    }

    const user = await getUser(session.user.email);

    if (!user) {
      throw new Error('cannot generate avatar for non-existent user');
    }

    if (user.credits <= 0) {
      throw new Error('cannot generate avatar without credits');
    }

    return user;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const session = await getSession(req, res);
    const user = await getUserAndValidateCredits(session);

    if (!user) {
      throw new Error('cannot generate avatar user is null');
    }

    const avatarModels = await getAvatarModels(req.body, user.email);

    if (!avatarModels) {
      throw new Error('cannot generate avatar avatarModels is null');
    }

    return res.status(200).json({ avatars: avatarModels });
  } catch (err) {
    Logger.log('error', err);
    return res.status(500).send({ avatars: [] });
  }
}

export default handler;
