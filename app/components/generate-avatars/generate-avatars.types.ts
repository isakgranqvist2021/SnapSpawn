import { Characteristic, Gender, Traits } from '@aa/models';

export type ReducerAction =
  | { isLoading: boolean; type: 'set:isLoading' }
  | { age: number; type: 'set:age' }
  | { traits: Traits; type: 'set:traits' }
  | { gender: Gender; type: 'set:gender' }
  | { characteristics: Characteristic; type: 'set:characteristics' };
