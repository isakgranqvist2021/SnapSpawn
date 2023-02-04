import { AvatarDocument } from '@aa/database/avatar';

export interface AvatarModel extends Pick<AvatarDocument, 'prompt'> {
  createdAt: number;
  id: string;
  url: string;
}
