import { AvatarDocument, PromptOptions, getAvatars } from '@aa/database/avatar';
import { createUser, getUser } from '@aa/database/user';
import { AvatarModel } from '@aa/models/avatar';
import { getSignedUrls } from '@aa/services/gcp';
import { Logger } from '@aa/services/logger';
import { Session, getSession } from '@auth0/nextjs-auth0';
import { GetServerSidePropsContext } from 'next';

async function prepareAvatarModel(
  avatarDocument: AvatarDocument,
): Promise<AvatarModel | null> {
  try {
    const { _id, avatar, createdAt, prompt, promptOptions, parentId } =
      avatarDocument;

    const urls = await getSignedUrls(avatar);

    return {
      createdAt: new Date(createdAt).getTime(),
      id: _id.toHexString(),
      prompt,
      promptOptions,
      urls,
      parentId: parentId?.toString() ?? null,
    };
  } catch {
    return null;
  }
}

export async function loadServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx.req, ctx.res);

  if (!session?.user.email) {
    Logger.log('warning', session);
    return { props: { credits: 0, avatars: [] } };
  }

  const email = session.user.email;

  const user = await getUser({ email });

  if (user === null) {
    await createUser({ email });
    return { props: { credits: 0, avatars: [] } };
  }

  const avatarDocuments = await getAvatars({ email });

  if (!avatarDocuments) {
    Logger.log('warning', avatarDocuments);
    return { props: { credits: user.credits, avatars: [] } };
  }

  const avatarModels = await Promise.all(
    avatarDocuments.map(prepareAvatarModel),
  );

  const avatars = avatarModels.filter(
    (avatarModel): avatarModel is AvatarModel => avatarModel !== null,
  );

  return { props: { credits: user.credits, avatars } };
}

export async function getUserAndValidateCredits(session?: Session | null) {
  try {
    if (!session?.user.email) {
      throw new Error('cannot generate avatar while logged out');
    }

    const user = await getUser({ email: session.user.email });

    if (!user) {
      throw new Error('cannot generate avatar for non-existent user');
    }

    if (user.credits <= 0) {
      throw new Error('cannot generate avatar without credits');
    }

    return user;
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export function getPrompt(promptOptions: PromptOptions) {
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
      (value) => value !== "'none'",
    );

    parts.push(...values);
  }

  return parts.join(', ');
}
