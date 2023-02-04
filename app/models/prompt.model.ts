export const genders = ['male', 'female'] as const;

export const characteristics = [
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

export type Characteristic = (typeof characteristics)[number];

export interface PromptModel {
  age: number;
  characteristics: Characteristic;
  gender: Gender;
}
