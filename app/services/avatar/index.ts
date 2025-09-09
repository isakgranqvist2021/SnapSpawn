import { OPEN_AI_API_KEY } from '@aa/config';
import OpenAI from 'openai';

import { Logger } from '../logger';

const openai = new OpenAI({
  apiKey: OPEN_AI_API_KEY,
});

export async function generateAvatars(prompt: string) {
  try {
    const options: OpenAI.ImageGenerateParams = {
      prompt,
      n: 1,
      size: '1024x1024',
      model: 'dall-e-3',
    };

    const res = await openai.images.generate(options);
    if (!res.data) {
      throw new Error('No data returned');
    }

    return res.data
      .map((obj) => obj.url)
      .filter((url): url is string => typeof url === 'string');
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export async function createAvatarVariant(
  image: OpenAI.ImageCreateVariationParams['image'],
) {
  try {
    const options: OpenAI.ImageCreateVariationParams = {
      image,
      n: 1,
      size: '1024x1024',
    };

    const res = await openai.images.createVariation(options);
    if (!res.data) {
      throw new Error('No data returned');
    }

    return res.data
      .map((obj) => obj.url)
      .filter((url): url is string => typeof url === 'string');
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export async function editAvatar(
  image: OpenAI.ImageEditParams['image'],
  prompt: string,
) {
  try {
    const options: OpenAI.ImageEditParams = {
      image,
      n: 1,
      size: '1024x1024',
      prompt,
    };

    const res = await openai.images.edit(options);
    if (!res.data) {
      throw new Error('No data returned');
    }

    return res.data
      .map((obj) => obj.url)
      .filter((url): url is string => typeof url === 'string');
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}
