import clientPromise from '../mongodb';

const COLLECTION_NAME = 'users';

export async function addUser(uid: string) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const res = await db.collection(COLLECTION_NAME).insertOne({
      uid,
      credits: 0,
      avatars: [],
    });

    return res.insertedId.toString();
  } catch {
    return null;
  }
}
