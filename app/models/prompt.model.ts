export const genders = ['male', 'female', 'rather not say'] as const;

export const traits = [
  'casual',
  'fashionable',
  'futuristic',
  'goggles',
  'hat',
  'headband',
  'headphones',
  'mask',
  'scarf',
  'sporty',
  'sunglasses',
  'turban',
] as const;

export type Gender = (typeof genders)[number];

export type Traits = (typeof traits)[number];

export interface PromptModel {
  age: number;
  traits: Traits;
  gender: Gender;
}
