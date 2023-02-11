import 'dotenv/config';
import { createReadStream } from 'fs';
import { Configuration, OpenAIApi } from 'openai';
import path from 'path';

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;

if (!OPEN_AI_API_KEY) {
  throw new Error('OPENAI_API_KEY is null');
}

const configuration = new Configuration({ apiKey: OPEN_AI_API_KEY });
const openai = new OpenAIApi(configuration);

async function textGenerator(prompt: string) {
  const res = await openai.createCompletion({
    model: 'code-davinci-002',
    prompt,
    temperature: 0.2,
    max_tokens: 500,
    n: 1,
  });

  return res.data.choices[0].text;
}

async function createImageVariant(path: string) {
  const file: any = createReadStream(path);
  const res = await openai.createImageVariation(file, 1, '1024x1024');

  return res.data.data[0].url;
}

async function main() {
  const url = await createImageVariant(
    path.join(path.resolve('assets'), 'img-4cNJT7lfSEG6bnqyEFIVYIOU.png'),
  );

  console.log(url);

  // textGenerator('How would you go about tuning OpenAI Dall-E?');
}

main();
