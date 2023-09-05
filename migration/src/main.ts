import 'dotenv/config';
import { BSON, MongoClient } from 'mongodb';

const MONGO_URL_PROD = process.env.MONGO_DB_DATABASE_URL_PROD;
const MONGO_URL_DEV = process.env.MONGO_DB_DATABASE_URL_DEV;

if (!MONGO_URL_PROD || !MONGO_URL_DEV) {
  throw new Error('Missing MONGO_URL_PROD or MONGO_URL_DEV');
}

const client = new MongoClient(MONGO_URL_DEV);

async function main() {
  await client.connect();

  const collection = client.db().collection('avatars');

  await collection.updateMany(
    {
      'promptOptions.characteristics': {
        $exists: false,
      },
    },
    { $set: { 'promptOptions.characteristics': null } },
  );

  await collection.updateMany(
    {
      'promptOptions.gender': {
        $exists: false,
      },
    },
    { $set: { 'promptOptions.gender': null } },
  );

  await collection.updateMany(
    {
      'promptOptions.traits': {
        $exists: false,
      },
    },
    { $set: { 'promptOptions.traits': null } },
  );

  await collection.updateMany(
    {
      'promptOptions.custom': {
        $exists: false,
      },
    },
    { $set: { 'promptOptions.custom': false } },
  );

  await collection.updateMany(
    {
      'promptOptions.custom': 'custom',
    },
    { $set: { 'promptOptions.custom': true } },
  );

  await client.close();
}

main();
