import { Storage } from '@google-cloud/storage';
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import sharp from 'sharp';

const client = new MongoClient(process.env.MONGO_DB_DATABASE_URL_DEV!);

export const fileSizes = [
  '1024x1024',
  '512x512',
  '256x256',
  '128x128',
] as const;

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    type: 'service_account',
    private_key: process.env.GCP_PRIVATE_KEY,
    client_email: process.env.GCP_CLIENT_EMAIL,
    client_id: process.env.GCP_CLIENT_ID,
  },
});

const bucket = storage.bucket(process.env.GCP_BUCKET_NAME!);

export function getImageFromUrl(url: string) {
  return fetch(url).then((res) => res.blob());
}

async function createPictureSizes(ids: string[]) {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];

    try {
      const url = await bucket.file(`${id}.png`).getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      });

      if (!url) {
        continue;
      }

      const blob = await getImageFromUrl(url[0]);

      const arrayBuffer = await blob.arrayBuffer();

      await Promise.all(
        fileSizes.map(async (size) => {
          const [width, height] = size.split('x');

          const resizedBuffer = await sharp(arrayBuffer)
            .resize(parseInt(width), parseInt(height))
            .png()
            .toBuffer();

          await bucket.file(`${id}-${size}.png`).save(resizedBuffer);
        }),
      );
    } catch (err) {
      console.log(id, err);
      continue;
    }
  }
}

async function fillGaps(ids: string[]) {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];

    const url = await bucket.file(`${id}.png`).getSignedUrl({
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    });

    const blob = await getImageFromUrl(url[0]);

    const arrayBuffer = await blob.arrayBuffer();

    for (let j = 0; j < fileSizes.length; j++) {
      const size = fileSizes[j];
      const [exists] = await bucket.file(`${id}-${size}.png`).exists();

      if (exists) {
        continue;
      }

      const [width, height] = size.split('x');

      const resizedBuffer = await sharp(arrayBuffer)
        .resize(parseInt(width), parseInt(height))
        .png()
        .toBuffer();

      console.log('Saving', `${id}-${size}.png`);

      await bucket.file(`${id}-${size}.png`).save(resizedBuffer);
    }
  }
}

async function deleteAvatars(ids: string[]) {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];

    const [exists] = await bucket.file(`${id}.png`).exists();

    if (!exists) {
      continue;
    }

    console.log('Deleting', `${id}.png`);
    await bucket.file(`${id}.png`).delete();
  }
}

async function main() {
  const files = await bucket.getFiles({});

  const x: any[] = [];

  files[0].forEach((file) => {
    if (!file.id?.includes('-')) {
      x.push(file.id?.replace('.png', ''));
    }
  });

  await deleteAvatars(x);
}

main();
