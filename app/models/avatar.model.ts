import { AvatarDocument } from '@aa/database/avatar';

export interface AvatarModel extends Pick<AvatarDocument, 'prompt'> {
  id: string;
  url: string;
  createdAt: number;
}
