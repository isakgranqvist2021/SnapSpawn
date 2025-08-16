export const avatarSizes = [
  '1024x1024',
  '512x512',
  '256x256',
  '128x128',
] as const;

export interface AvatarURLs {
  '1024x1024': string;
  '128x128': string;
  '256x256': string;
  '512x512': string;
}

export type AvatarURLSize = keyof AvatarURLs;

export interface AvatarModel {
  createdAt: number;
  id: string;
  parentId: string | null;
  prompt: string;
  urls: AvatarURLs;
}
