import 'dotenv/config';
import { MongoClient, BSON } from 'mongodb';

const MONGO_URL_PROD = process.env.MONGO_DB_DATABASE_URL_PROD;
const MONGO_URL_DEV = process.env.MONGO_DB_DATABASE_URL_DEV;

if (!MONGO_URL_PROD || !MONGO_URL_DEV) {
	throw new Error('Missing MONGO_URL_PROD or MONGO_URL_DEV');
}

const client = new MongoClient(MONGO_URL_PROD);

type PromptOptions = Record<string, any> | null;

interface DepAvatarDocument {
	_id: BSON.ObjectId;
	avatar: string;
	createdAt: number;
	email: string;
	prompt: string;
}

interface AvatarDocument {
	_id: BSON.ObjectId;
	avatar: string;
	createdAt: number;
	email: string;
	prompt: string;
	promptOptions: PromptOptions;
}

function getPrompt(promptOptions: PromptOptions) {
	const parts = [
		'circle shaped',
		'close up',
		'medium light',
		'fictional',
		'digital social media profile avatar',
		'colourful lighting',
		'vector art',
	];

	if (promptOptions) {
		const values = Object.values(promptOptions).filter(
			(value) => value !== "'rather not say'"
		);

		parts.push(...values);
	}

	return parts.join(', ');
}

async function main() {
	await client.connect();

	const collection = client.db().collection('avatars');

	const docs = await collection
		.find<DepAvatarDocument>({
			promptOptions: { $exists: false },
		})
		.toArray();

	let queue = 0;
	await Promise.all(
		docs.map((doc) => {
			queue++;
			console.log('Queue', queue);

			const parts = doc.prompt.split('&').map((part) => part.split('='));

			const promptOptions: PromptOptions = {};

			for (const [key, value] of parts) {
				promptOptions[key] = value;
			}

			return collection.updateOne(
				{ _id: doc._id },
				{ $set: { promptOptions, prompt: getPrompt(promptOptions) } }
			);
		})
	);

	await client.close();
}

main();
