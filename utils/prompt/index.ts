const genders = ['male', 'female'] as const;
const characteristics = ['strong', 'cute', 'nerdy'] as const;

export interface PromptOptions {
  age: number;
  gender: (typeof genders)[number];
  characteristics: (typeof characteristics)[number];
}

function getPrompt(options: PromptOptions) {
  const { age, characteristics, gender } = options;

  return `
		I want a ${gender} avatar 
		that is ${age} years old and has 
		the following characteristics ${characteristics}
	`;
}

export default getPrompt;
