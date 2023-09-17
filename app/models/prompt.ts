export const genders = ['male', 'female', 'none'] as const;

export const traits = [
  'baseball cap',
  'beard',
  'goggles',
  'hat',
  'headband',
  'headphones',
  'mask',
  'scarf',
  'sunglasses',
  'texture bucket hat',
  'turban',
  'wings',
  'witch hat',
  'wizard hat',
] as const;

export const characteristics = [
  '2014-era tumblr',
  '70s disco',
  'afrofuturism',
  'apocalyptic',
  'bastardcore',
  'biopunk',
  'bubblegum witch',
  'cybernetic',
  'cyberpunk',
  'dieselpunk',
  'fantasy',
  "farmer's daughter",
  'holosexual',
  'memphis',
  'steampunk',
  'vaporwave',
  'victorian',
  'y2k',
] as const;

export type Gender = (typeof genders)[number];
export type Traits = (typeof traits)[number];
export type Characteristic = (typeof characteristics)[number];

export interface GeneralAvatarModel {
  characteristics: Characteristic;
  gender: Gender;
  traits: Traits;
}
