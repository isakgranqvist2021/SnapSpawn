export const genders = ['male', 'female'] as const;

export const characteristics = [
  'futuristic',
  'fashionable',
  'casual',
  'sporty',
  'goggles',
  'hat',
  'headband',
  'headphones',
  'mask',
  'scarf',
  'sunglasses',
  'turban',
] as const;

export interface PromptOptions {
  age: number;
  gender: (typeof genders)[number];
  characteristics: (typeof characteristics)[number];
}

export function getPrompt(options: PromptOptions) {
  const { age, characteristics, gender } = options;

  return `Can you give me a ${gender} avatar who is ${age} old and has the following characteristics: ${characteristics}?`;
}
