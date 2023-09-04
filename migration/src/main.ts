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

  await collection.updateMany({}, { $set: { parentId: null } });
  await collection.updateMany({}, { $unset: { variant: 1 } });

  //   const docs = await collection.find<AvatarDocument>({}).toArray();

  //   const keys: string[] = [];
  //   docs.forEach((doc) => {
  //     keys.push(...Object.keys(doc.promptOptions ?? {}));
  //   });

  //   console.log(Array.from(new Set(keys)));

  await client.close();

  // let queue = 0;
  // await Promise.all(
  // 	docs.map((doc) => {
  // 		queue++;
  // 		console.log('Queue', queue);

  // 		const parts = doc.prompt.split('&').map((part) => part.split('='));

  // 		const promptOptions: PromptOptions = {};

  // 		for (const [key, value] of parts) {
  // 			promptOptions[key] = value;
  // 		}

  // 		return collection.updateOne(
  // 			{ _id: doc._id },
  // 			{ $set: { promptOptions, prompt: getPrompt(promptOptions) } }
  // 		);
  // 	})
  // );

  // await client.close();
}

main();
