import { PromptOptions } from '@aa/database/avatar';

export const avatarSizes = ['256x256', '512x512', '1024x1024'] as const;
export type Size = (typeof avatarSizes)[number];

export interface URLS {
  '1024x1024': string;
  '128x128': string;
  '256x256': string;
  '512x512': string;
}

export interface AvatarModel {
  createdAt: number;
  id: string;
  parentId: string | null;
  prompt: string;
  promptOptions: PromptOptions;
  urls: URLS;
}
