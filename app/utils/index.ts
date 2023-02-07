import { AvatarDocument } from '@aa/database/avatar';
import { AvatarModel } from '@aa/models';
import { getSignedUrl } from '@aa/services/gcp';

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
