const genders = ['male', 'female'] as const;

const characteristics = [
  'kind',
  'leader',
  'considerate',
  'empathetic',
  'reliable',
  'intelligent',
  'innovative',
  'thoughtful',
  'consientious',
  'efficient',
  'responsible',
  'brave',
] as const;

export interface PromptOptions {
  age: number;
  gender: (typeof genders)[number];
  characteristics: (typeof characteristics)[number];
}

export function getPrompt(options: PromptOptions) {
  const { age, characteristics, gender } = options;

  return [age, characteristics, gender].join(',');
}
