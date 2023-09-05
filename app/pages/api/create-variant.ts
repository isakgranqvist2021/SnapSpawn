import { createAvatars, getAvatar } from '@aa/database/avatar';
import { createTransaction } from '@aa/database/transaction';
import { reduceUserCredits } from '@aa/database/user';
import { AvatarModel, Size, avatarSizes } from '@aa/models/avatar';
import { createAvatarVariant } from '@aa/services/avatar';
import { getSignedUrls, uploadAvatar } from '@aa/services/gcp';
import { Logger } from '@aa/services/logger';
import { getUserAndValidateCredits } from '@aa/utils';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

async function createAvatarVariants(
  id: string,
  email: string,
  size: Size,
  n: number,
) {
  try {
    /*
     * Get avatar from MongoDB that we want to generate variants for
     */
    const avatar = await getAvatar({ id });
    if (!avatar) {
      throw new Error('cannot generate avatar for non-existent avatar');
    }

    /*
     * Generate avatars from OpenAI API
     */
    const url = await getSignedUrls(avatar.avatar);
    const res = await fetch(url['1024x1024']);
    const openAiUrls = await createAvatarVariant(res, size, n);
    if (!openAiUrls) {
      throw new Error("couldn't generate avatars");
    }

    /*
     * Upload avatars to GCP
     */
    const avatarIds = await uploadAvatar(openAiUrls);
    if (!avatarIds.length) {
      throw new Error("couldn't upload avatars");
    }

    /*
     * Create avatars in MongoDB
     */
    const createdAvatars = await createAvatars({
      avatars: avatarIds,
      email,
      prompt: avatar.prompt,
      promptOptions: avatar.promptOptions,
      parentId: new ObjectId(id),
    });
    if (!createdAvatars) {
      throw new Error("couldn't create avatars");
    }

    /*
     * Get signed URLs for avatars and map to AvatarModel
     */
    const insertedKeys = Object.values(createdAvatars.insertedIds);
    const newAvatars = await Promise.all(
      avatarIds.map(async (avatarId, i): Promise<AvatarModel> => {
        const urls = await getSignedUrls(avatarId);

        return {
          createdAt: Date.now(),
          id: insertedKeys[i].toString(),
          prompt: avatar.prompt,
          parentId: id,
          promptOptions: avatar.promptOptions,
          urls,
        };
      }),
    );

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

async function createVariant(req: NextApiRequest, res: NextApiResponse) {
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

    const avatarModels = await createAvatarVariants(
      req.body.id,
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

export default withApiAuthRequired(createVariant);
