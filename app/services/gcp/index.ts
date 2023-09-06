import {
  GCP_BUCKET_NAME,
  GCP_CLIENT_EMAIL,
  GCP_CLIENT_ID,
  GCP_PRIVATE_KEY,
  GCP_PROJECT_ID,
} from '@aa/config';
import { AvatarURLs, avatarSizes } from '@aa/models/avatar';
import { Storage } from '@google-cloud/storage';
import formidable from 'formidable';
import fs from 'fs';
import sharp from 'sharp';
import { uid } from 'uid';

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
        const blob = await fetch(avatarUrl).then((res) => res.blob());
        const arrayBuffer = await blob.arrayBuffer();
        const avatarId = uid();

        await Promise.all(
          avatarSizes.map(async (size) => {
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

export async function uploadFile(
  files: formidable.Files<string>,
): Promise<string[]> {
  if (!Array.isArray(files.files)) {
    return [];
  }

  const avatarIds = await Promise.all(
    files.files.map(async (file): Promise<string | null> => {
      if (
        (file.mimetype !== 'image/png' &&
          file.mimetype !== 'image/jpeg' &&
          file.mimetype !== 'image/jpg') ||
        file.size > 10000000
      ) {
        return null;
      }

      try {
        const buffer = fs.readFileSync(file.filepath);
        const avatarId = uid();

        await Promise.all(
          avatarSizes.map(async (size) => {
            const resizedBuffer = await sharp(buffer)
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

export async function getSignedUrls(avatarId: string): Promise<AvatarURLs> {
  const urls: AvatarURLs = {
    '1024x1024': '',
    '128x128': '',
    '256x256': '',
    '512x512': '',
  };

  for (let i = 0; i < avatarSizes.length; i++) {
    const size = avatarSizes[i];

    const file = bucket.file(`${avatarId}-${size}.png`);

    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + ONE_HOUR_IN_MS,
    });

    urls[size] = signedUrl;
  }

  return urls;
}
