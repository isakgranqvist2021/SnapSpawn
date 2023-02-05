import { PromptModel } from '@aa/models';

import { State } from './generate-avatars.context';

const DEFAULT_FORM_STATE: PromptModel = {
  age: 32,
  characteristics: ['casual'],
  eyeColor: 'blue',
  gender: 'female',
  hairType: 'bald',
  traits: 'beard',
};

export const DEFAULT_STATE: State = {
  form: DEFAULT_FORM_STATE,
  isLoading: false,
};
