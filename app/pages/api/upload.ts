import { createAvatars } from '@aa/database/avatar';
import { AvatarModel } from '@aa/models/avatar';
import { getSignedUrls, uploadFile } from '@aa/services/gcp';
import { Logger } from '@aa/services/logger';
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import formidable from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function createAvatarModels(
  files: formidable.Files<string>,
  email: string,
) {
  try {
    /*
     * Upload avatars to GCP
     */
    const avatarIds = await uploadFile(files);
    if (!avatarIds.length) {
      throw new Error("couldn't upload avatars");
    }

    /*
     * Create avatars in MongoDB
     */
    const createdAvatars = await createAvatars({
      avatars: avatarIds,
      email,
      prompt: '',
      parentId: null,
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
          prompt: '',
          urls,
          parentId: null,
        };
      }),
    );

    return newAvatars;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

async function upload(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }

    const session = await getSession(req, res);
    if (!session?.user.email) {
      throw new Error('cannot upload picture user is null');
    }

    formidable().parse(req, async (err, _, files) => {
      try {
        if (err) {
          throw new Error('cannot upload picture form parse error');
        }

        const avatarModels = await createAvatarModels(
          files,
          session.user.email,
        );
        if (!avatarModels) {
          throw new Error('cannot upload picture avatarModels is null');
        }

        return res.status(200).json({ avatars: avatarModels });
      } catch (err) {
        Logger.log('error', err);
        return res.status(500).send({ avatars: null });
      }
    });
  } catch (err) {
    Logger.log('error', err);
    return res.status(500).send({ avatars: null });
  }
}

export default withApiAuthRequired(upload);
