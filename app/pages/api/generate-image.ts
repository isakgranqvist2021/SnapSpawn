import { createAvatars } from '@aa/database/avatar';
import { createTransaction } from '@aa/database/transaction';
import { reduceUserCredits } from '@aa/database/user';
import { AvatarModel } from '@aa/models/avatar';
import { generateAvatars } from '@aa/services/avatar';
import { getSignedUrls, uploadAvatar } from '@aa/services/gcp';
import { Logger } from '@aa/services/logger';
import { getUserAndValidateCredits } from '@aa/utils';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

async function createAvatarModels(prompt: string, email: string) {
  try {
    /*
     * Generate avatars from OpenAI API
     */
    const openAiUrls = await generateAvatars(prompt);
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
      email,
      avatars: avatarIds,
      parentId: null,
      prompt,
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
          urls,
          prompt,
          parentId: null,
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

    const avatarModels = await createAvatarModels(req.body.options, user.email);
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
