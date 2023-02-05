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
] as const;

export const hairColors = [
  'black',
  'blonde',
  'brown',
  'platinum',
  'red',
  'none',
] as const;

export const eyeColors = ['blue', 'brown', 'green', 'hazel'] as const;

export const hairTypes = [
  'bald',
  'curly',
  'wavy',
  'afro',
  'bun',
  'ponytail',
  'mohawk',
  'shaved',
] as const;

export type Gender = (typeof genders)[number];
export type Traits = (typeof traits)[number];
export type Characteristic = (typeof characteristics)[number];
export type EyeColor = (typeof eyeColors)[number];
export type HairType = (typeof hairTypes)[number];

export interface PromptModel {
  age: number;
  characteristics: Characteristic[];
  eyeColor: EyeColor;
  gender: Gender;
  hairType: HairType;
  traits: Traits;
}
