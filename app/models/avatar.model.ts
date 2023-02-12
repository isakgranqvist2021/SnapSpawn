import { AvatarDocument } from '@aa/database/avatar';

export const avatarSizes = ['256x256', '512x512', '1024x1024'] as const;
export type Size = (typeof avatarSizes)[number];

export interface AvatarModel extends Pick<AvatarDocument, 'prompt'> {
  createdAt: number;
  id: string;
  url: string;
}
