import { PromptOptions, createAvatars } from '@aa/database/avatar';
import { createTransaction } from '@aa/database/transaction';
import { getUser, reduceUserCredits } from '@aa/database/user';
import { AvatarModel } from '@aa/models';
import { generateAvatars } from '@aa/services/avatar';
import { getSignedUrl, uploadAvatar } from '@aa/services/gcp';
import { Logger } from '@aa/services/logger';
import { Session, getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

function getPrompt(promptOptions: PromptOptions) {
  const parts = [
    'circle shaped',
    'close up',
    'medium light',
    'fictional',
    'digital social media profile avatar',
    'colourful lighting',
    'vector art',
  ];

  if (promptOptions) {
    const values = Object.values(promptOptions).filter(
      (value) => value !== "'rather not say'",
    );

    parts.push(...values);
  }

  return parts.join(', ');
}

async function createAvatarModels(promptOptions: PromptOptions, email: string) {
  try {
    const prompt = getPrompt(promptOptions);
    const openAiUrls = await generateAvatars(prompt);

    const prepareAvatarModel = async (
      avatarId: string,
    ): Promise<AvatarModel> => {
      const url = await getSignedUrl(avatarId);

      return {
        createdAt: Date.now(),
        id: avatarId,
        prompt,
        promptOptions,
        url,
      };
    };

    if (!openAiUrls) {
      throw new Error("couldn't generate avatars");
    }

    const avatarIds = await uploadAvatar(openAiUrls);

    await createAvatars({
      avatars: avatarIds,
      email,
      prompt,
      promptOptions,
    });

    const newAvatars = await Promise.all(avatarIds.map(prepareAvatarModel));

    if (newAvatars.length > 0) {
      await reduceUserCredits({ email, credits: openAiUrls.length });
      await createTransaction({ email, credits: openAiUrls.length });
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

    const user = await getUser({ email: session.user.email });

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

async function create(req: NextApiRequest, res: NextApiResponse) {
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

    const avatarModels = await createAvatarModels(req.body, user.email);

    if (!avatarModels) {
      throw new Error('cannot generate avatar avatarModels is null');
    }

    return res.status(200).json({ avatars: avatarModels });
  } catch (err) {
    Logger.log('error', err);
    return res.status(500).send({ avatars: null });
  }
}

export default withApiAuthRequired(create);
