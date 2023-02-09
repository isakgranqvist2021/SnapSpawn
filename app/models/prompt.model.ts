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
  'vaporwave',
  'apocalyptic',
  'gothic, fantasy',
  'cybernetic',
  'steampunk',
  'memphis',
  'dieselpunk',
  'afrofuturism',
  'cyberpunk',
  'biopunk',
] as const;

export const eyeColors = ['blue', 'brown', 'green', 'hazel'] as const;

export type Gender = (typeof genders)[number];
export type Traits = (typeof traits)[number];
export type Characteristic = (typeof characteristics)[number];

export interface PromptModel {
  characteristics: Characteristic;
  gender: Gender;
  traits: Traits;
}
