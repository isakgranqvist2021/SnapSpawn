import { AvatarDocument, getAvatars } from '@aa/database/avatar';
import { createUser, getUser } from '@aa/database/user';
import { AvatarModel } from '@aa/models';
import { getSignedUrl } from '@aa/services/gcp';
import { Logger } from '@aa/services/logger';
import { getSession } from '@auth0/nextjs-auth0';
import { GetServerSidePropsContext } from 'next';

export async function prepareAvatarModel(
  avatarDocument: AvatarDocument,
): Promise<AvatarModel | null> {
  try {
    const { _id, avatar, createdAt, prompt } = avatarDocument;

    const url = await getSignedUrl(avatar);

    return {
      createdAt: new Date(createdAt).getTime(),
      id: _id.toHexString(),
      prompt,
      url,
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

  const user = await getUser(session.user.email);

  if (user === null) {
    await createUser(session.user.email);
    return { props: { credits: 0, avatars: [] } };
  }

  const avatarDocuments = await getAvatars(session.user.email);

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
