import { Characteristic, EyeColor, Gender, HairType, Traits } from '@aa/models';

export type ReducerAction =
  | { isLoading: boolean; type: 'set:isLoading' }
  | { age: number; type: 'set:age' }
  | { traits: Traits; type: 'set:traits' }
  | { gender: Gender; type: 'set:gender' }
  | { eyeColor: EyeColor; type: 'set:eyeColor' }
  | { hairType: HairType; type: 'set:hairType' }
  | { characteristics: Characteristic; type: 'set:characteristics' };
