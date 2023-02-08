import { createAvatars } from '@aa/database/avatar';
import { getUser, reduceUserCredits } from '@aa/database/user';
import { AvatarModel } from '@aa/models';
import { PromptModel } from '@aa/models/prompt.model';
import { generateAvatars } from '@aa/services/avatar';
import { getSignedUrl, uploadAvatar } from '@aa/services/gcp';
import { Logger } from '@aa/services/logger';
import { Session, getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';

interface Data {
  avatars: AvatarModel[] | null;
}

function getPrompt(promptModel: PromptModel) {
  const { age, characteristics, eyeColor, gender, hairType, traits } =
    promptModel;

  const parts = [
    '2d vector art, dark background,',
    `${age} years old`,
    traits,
    `${eyeColor} eyes`,
    `${hairType} hair`,
    ...characteristics,
  ];

  if (gender !== 'rather not say') {
    parts.push(gender);
  }

  return parts.join(' ');
}

async function getAvatarModels(promptModel: PromptModel, email: string) {
  try {
    const prompt = getPrompt(promptModel);

    const openAiUrls = await generateAvatars(prompt);

    if (!openAiUrls) {
      throw new Error("couldn't generate avatars");
    }

    const avatarIds = await uploadAvatar(openAiUrls);

    const query = Object.keys(promptModel)
      .map((key) => `${key}=${promptModel[key as keyof PromptModel]}`)
      .join('&');

    await createAvatars(email, avatarIds, query);

    const newAvatars = await Promise.all(
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

    if (newAvatars.length > 0) {
      await reduceUserCredits(email, openAiUrls.length);
    }

    return newAvatars;
  } catch (err) {
    Logger.log('error', err);
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
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }

    req.body = JSON.parse(req.body);

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
    return res.status(500).send({ avatars: null });
  }
}

export default withApiAuthRequired(handler);
