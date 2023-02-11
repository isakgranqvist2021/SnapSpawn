import { AvatarModel, Characteristic, Gender, Traits } from '@aa/models';

export type GenerateAvatarApiResponse =
  | {
      avatars: AvatarModel[];
    }
  | undefined;

export type ReducerAction =
  | { isLoading: boolean; type: 'set:isLoading' }
  | { age: number; type: 'set:age' }
  | { traits: Traits; type: 'set:traits' }
  | { gender: Gender; type: 'set:gender' }
  | { characteristics: Characteristic; type: 'set:characteristics' }
  | { type: 'set:result'; result: string[] }
  | { type: 'clear:result' };
