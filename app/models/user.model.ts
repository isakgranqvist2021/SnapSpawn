import { UserDocument } from '@aa/database/user';

export interface UserModel
  extends Pick<UserDocument, 'email' | 'credits' | 'createdAt'> {
  id: string;
}
