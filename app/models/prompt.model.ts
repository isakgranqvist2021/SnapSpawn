export const genders = ['male', 'female', 'rather not say'] as const;

export const traits = [
  'beard',
  'goggles',
  'hat',
  'headband',
  'headphones',
  'mask',
  'scarf',
  'sunglasses',
  'turban',
  'wings',
] as const;

export const characteristics = [
  'bohemian',
  'business',
  'casual',
  'club',
  'fashionable',
  'formal',
  'futuristic',
  'goth',
  'grunge',
  'hipster',
  'party',
  'preppy',
  'professional',
  'punk',
  'retro',
  'sporty',
  'streetwear',
  'viking',
  'vintage',
];

export type Gender = (typeof genders)[number];

export type Traits = (typeof traits)[number];

export type Characteristic = (typeof characteristics)[number];

export interface PromptModel {
  age: number;
  characteristics: Characteristic;
  gender: Gender;
  traits: Traits;
}
