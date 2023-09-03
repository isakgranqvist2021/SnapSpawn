import { createAvatars } from '@aa/database/avatar';
import { createTransaction } from '@aa/database/transaction';
import { getUser, reduceUserCredits } from '@aa/database/user';
import { AvatarModel, Size, avatarSizes } from '@aa/models/avatar';
import { generateAvatars } from '@aa/services/avatar';
import { getSignedUrl, uploadAvatar } from '@aa/services/gcp';
import { Logger } from '@aa/services/logger';
import { Session, getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

async function createAvatarModels(
  prompt: string,
  email: string,
  size: Size,
  n: number,
) {
  try {
    const openAiUrls = await generateAvatars(prompt, size, n);

    const prepareAvatarModel = async (
      avatarId: string,
    ): Promise<AvatarModel> => {
      const url = await getSignedUrl(avatarId);

      return {
        createdAt: Date.now(),
        id: avatarId,
        promptOptions: { custom: 'custom' },
        url,
        prompt,
      };
    };

    if (!openAiUrls) {
      throw new Error("couldn't generate avatars");
    }

    const avatarIds = await uploadAvatar(openAiUrls);

    await createAvatars({
      email,
      avatars: avatarIds,
      promptOptions: { custom: 'custom' },
      prompt,
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

    if (req.body.n > 5) {
      throw new Error('cannot generate more than 5 avatars at a time');
    }

    if (!avatarSizes.includes(req.body.size)) {
      throw new Error('cannot generate avatar with invalid size');
    }

    const avatarModels = await createAvatarModels(
      req.body.options,
      user.email,
      req.body.size,
      req.body.n,
    );

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
