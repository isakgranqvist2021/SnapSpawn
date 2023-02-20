import 'dotenv/config';
import {
  createReadStream,
  createWriteStream,
  mkdirSync,
  readdirSync,
  statSync,
} from 'fs';
import https from 'https';
import sizeOf from 'image-size';
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
  try {
    const file: any = createReadStream(path);

    const size = sizeOf(path);

    const res = await openai.createImageVariation(
      file,
      1,
      `${size.width}x${size.height}`,
    );

    return res.data.data[0].url;
  } catch (e) {
    console.error(e);
  }
}

async function downloadImageFromUrl(
  url: string,
  dest: string,
  filename: string,
) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const ext = res.headers['content-type']?.split('/')[1];

      if (!ext) {
        reject(new Error('Invalid content type'));
      }

      if (res.statusCode === 200) {
        res
          .pipe(createWriteStream(path.join(dest, `${filename}.${ext}`)))
          .on('error', reject)
          .once('close', () => resolve(path.join(dest, `${filename}.${ext}`)));
      } else {
        res.resume();
        reject(
          new Error(`Request Failed With a Status Code: ${res.statusCode}`),
        );
      }
    });
  });
}

async function readFilesFromAssets() {
  const files = readdirSync(path.resolve('../marketing-assets'))
    .filter((file) => file.endsWith('.jpg') || file.endsWith('.png'))
    .slice(0, 1);


  const urls = await Promise.all(
    files.map(async (file) => {
      const url = await createImageVariant(
        path.join(path.resolve('../marketing-assets'), file),
      );

      return url;
    }),
  );


  const stringUrls = urls.filter((url): url is string => url !== undefined);
  const outputPath = `${Date.now().toString()}_${stringUrls.length.toString()}`;
  const outputDir = path.resolve(outputPath);
  const dest = path.join('../marketing-assets', outputPath);

  mkdirSync(outputDir);

  mkdirSync(dest);

  await Promise.all(
    stringUrls.map(async (url, i) => {
      return downloadImageFromUrl(url, dest, `file-${i}`);
    }),
  );
}

async function main() {
  await readFilesFromAssets();
}

main();
