import { createAvatars, getAvatar } from '@aa/database/avatar';
import { createTransaction } from '@aa/database/transaction';
import { reduceUserCredits } from '@aa/database/user';
import { AvatarModel } from '@aa/models/avatar';
import { editAvatar } from '@aa/services/avatar';
import { getSignedUrls, uploadAvatar } from '@aa/services/gcp';
import { Logger } from '@aa/services/logger';
import { getUserAndValidateCredits } from '@aa/utils';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { toFile } from 'openai';
import sharp from 'sharp';

async function createAvatarEdit(id: string, prompt: string, email: string) {
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
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const transformedImage = await sharp(buffer)
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true });

    const imageFile = await toFile(transformedImage.data, 'image.png', {
      type: 'image/png',
    });
    const openAiUrls = await editAvatar(imageFile, prompt);
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

export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
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

      const avatarModels = await createAvatarEdit(
        req.body.id,
        req.body.prompt,
        user.email,
      );
      if (!avatarModels) {
        throw new Error('cannot generate avatar avatarModels is null');
      }

      return res.status(200).json({ avatars: avatarModels });
    } catch (err) {
      Logger.log('error', err);
      return res.status(500).send({ avatars: null });
    }
  },
);
