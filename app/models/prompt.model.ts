export const genders = ['male', 'female', 'rather not say'] as const;

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
] as const;

export const characteristics = [
  '2014-era tumblr',
  '70s disco',
  'afrofuturism',
  'apocalyptic',
  'asian baby girl',
  'bastardcore',
  'biopunk',
  'bubblegum witch',
  'cybernetic',
  'cyberpunk',
  'dieselpunk',
  'e-boy',
  'e-girl',
  'fantasy',
  "farmer's daughter",
  'holosexual',
  'memphis',
  'steampunk',
  'vaporwave',
] as const;

console.log({
  traits: (traits as any).sort((a: any, b: any) => a.localeCompare(b)),
  characteristics: (characteristics as any).sort((a: any, b: any) =>
    a.localeCompare(b),
  ),
});

export const eyeColors = ['blue', 'brown', 'green', 'hazel'] as const;

export type Gender = (typeof genders)[number];
export type Traits = (typeof traits)[number];
export type Characteristic = (typeof characteristics)[number];

export interface PromptModel {
  characteristics: Characteristic;
  gender: Gender;
  traits: Traits;
}
