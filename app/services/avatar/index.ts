import { OPEN_AI_API_KEY } from '@aa/config';
import { Size, avatarSizes } from '@aa/models';
import { Configuration, CreateImageRequest, OpenAIApi } from 'openai';

import { Logger } from '../logger';

const configuration = new Configuration({ apiKey: OPEN_AI_API_KEY });
const openai = new OpenAIApi(configuration);

const maxN = 10;
const minN = 1;

export async function generateAvatars(
  prompt: string,
  size: Size = '1024x1024',
  n = 1,
) {
  try {
    if (n > maxN) {
      throw new Error(`n must be less than ${maxN}`);
    }

    if (n < minN) {
      throw new Error(`n must be greater than ${minN}`);
    }

    if (!avatarSizes.includes(size)) {
      throw new Error(`size must be one of ${avatarSizes.join(', ')}`);
    }

    const options: CreateImageRequest = {
      prompt,
      n,
      size,
    };

    const res = await openai.createImage(options);

    const data = res.data.data;

    if (!data) {
      throw new Error('No data returned');
    }

    const urls = data.map((obj) => obj.url);

    return urls.filter((url): url is string => typeof url === 'string');
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export function getImageFromUrl(url: string) {
  return fetch(url).then((res) => res.blob());
}
