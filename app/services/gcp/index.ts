import {
  GCP_BUCKET_NAME,
  GCP_CLIENT_EMAIL,
  GCP_CLIENT_ID,
  GCP_PRIVATE_KEY,
  GCP_PROJECT_ID,
} from '@aa/config';
import { URLS } from '@aa/models/avatar';
import { Storage } from '@google-cloud/storage';
import sharp from 'sharp';
import { uid } from 'uid';

import { getImageFromUrl } from '../avatar';
import { Logger } from '../logger';

const ONE_HOUR_IN_MS = 1000 * 60 * 60;

export const fileSizes = [
  '1024x1024',
  '512x512',
  '256x256',
  '128x128',
] as const;

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

        await Promise.all(
          fileSizes.map(async (size) => {
            const resizedBuffer = await sharp(arrayBuffer)
              .resize(parseInt(size.split('x')[0]))
              .png()
              .toBuffer();

            await bucket.file(`${avatarId}-${size}.png`).save(resizedBuffer);
          }),
        );

        return avatarId;
      } catch (err) {
        Logger.log('error', 'Error uploading avatar', err);
        return null;
      }
    }),
  );

  return avatarIds.filter((avatarId): avatarId is string => avatarId !== null);
}

export async function getSignedUrls(avatarId: string): Promise<URLS> {
  const urls: URLS = {
    '1024x1024': '',
    '128x128': '',
    '256x256': '',
    '512x512': '',
  };

  for (let i = 0; i < fileSizes.length; i++) {
    const file = bucket.file(`${avatarId}-${fileSizes[i]}.png`);

    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + ONE_HOUR_IN_MS,
    });

    urls[fileSizes[i]] = signedUrl;
  }

  return urls;
}
