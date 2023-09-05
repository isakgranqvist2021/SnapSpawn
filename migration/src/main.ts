import { Storage } from '@google-cloud/storage';
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import sharp from 'sharp';

const client = new MongoClient(process.env.MONGO_DB_DATABASE_URL_PROD!);

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
  await Promise.all(
    ids.map(async (id) => {
      try {
        const url = await bucket.file(`${id}.png`).getSignedUrl({
          action: 'read',
          expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        });

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

        await bucket.file(`${id}.png`).delete();
      } catch (err) {
        console.log('error', 'Error uploading avatar', err);
      }
    }),
  );
}

async function main() {
  await client.connect();

  const collection = client.db().collection('avatars');

  const docs = await collection.find({}).toArray();

  const avatars = docs.map((doc) => doc.avatar);

  await createPictureSizes(avatars.slice(1, avatars.length));

  await client.close();
}

main();
