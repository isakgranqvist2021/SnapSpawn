import {
  GCP_BUCKET_NAME,
  GCP_CLIENT_EMAIL,
  GCP_CLIENT_ID,
  GCP_PRIVATE_KEY,
  GCP_PROJECT_ID,
} from '@aa/config';
import { Storage } from '@google-cloud/storage';
import { uid } from 'uid';

import { getImageFromUrl } from '../avatar';
import { Logger } from '../logger';

const ONE_HOUR_IN_MS = 1000 * 60 * 60;

const storage = new Storage({
  projectId: GCP_PROJECT_ID,
  credentials: {
    type: 'service_account',
    private_key: GCP_PRIVATE_KEY,
    client_email: GCP_CLIENT_EMAIL,
    client_id: GCP_CLIENT_ID,
  },
});

const bucket = storage.bucket(GCP_BUCKET_NAME);

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
        Logger.log(err);
        Logger.log('error', 'Error uploading avatar');
        return null;
      }
    }),
  );

  return avatarIds.filter((avatarId): avatarId is string => avatarId !== null);
}

export async function getSignedUrl(avatarId: string) {
  const file = bucket.file(`${avatarId}.png`);

  const [signedUrl] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + ONE_HOUR_IN_MS,
  });

  return signedUrl;
}
