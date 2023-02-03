import { env } from '@aa/config';
import { Storage } from '@google-cloud/storage';
import { uid } from 'uid';

import { getImageFromUrl } from '../avatar';
import { Logger } from '../logger';

const ONE_HOUR_IN_MS = 1000 * 60 * 60;

const storage = new Storage({
  projectId: env.projectId,
  credentials: {
    type: 'service_account',
    private_key: env.privateKey,
    client_email: env.clientEmail,
    client_id: env.clientId,
  },
});

const bucket = storage.bucket(env.bucketName);

export async function uploadAvatar(avatarUrls: string[]): Promise<string[]> {
  const avatarIds = await Promise.all(
    avatarUrls.map(async (avatarUrl): Promise<string | null> => {
      try {
        const blob = await getImageFromUrl(avatarUrl);
        const arrayBuffer = await blob.arrayBuffer();
        const avatarId = uid();

        await bucket.file(`${avatarId}.png`).save(Buffer.from(arrayBuffer));
        return avatarId;
      } catch (err) {
        console.log(err);
        Logger.log('error', 'Error uploading avatar');
        return null;
      }
    }),
  );

  return avatarIds.filter((avatarId): avatarId is string => avatarId !== null);
}

export async function generateSignedUrls(avatarIds: string[]) {
  return Promise.all(
    avatarIds.map(async (avatarId) => {
      const file = bucket.file(`${avatarId}.png`);

      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + ONE_HOUR_IN_MS,
      });

      return signedUrl;
    }),
  );
}
