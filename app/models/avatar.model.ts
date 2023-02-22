import { AvatarDocument, PromptOptions } from '@aa/database/avatar';

export const avatarSizes = ['256x256', '512x512', '1024x1024'] as const;
export type Size = (typeof avatarSizes)[number];

export interface AvatarModel {
  createdAt: number;
  id: string;
  prompt: string;
  promptOptions: PromptOptions;
  url: string;
}
