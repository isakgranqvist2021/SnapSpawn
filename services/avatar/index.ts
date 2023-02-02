import { env } from '@aa/config';

import { Logger } from '../logger';

interface ApiResponse {
  created: number;
  data: { url: string }[];
}

export async function generateAvatars(prompt: string) {
  try {
    const response: ApiResponse = await fetch(env.openAiBaseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.openAiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: '256x256',
      }),
    }).then((res) => res.json());

    return response.data.map((obj) => obj.url);
  } catch (err) {
    Logger.log('error', err);
    return [];
  }
}

export function getImageFromUrl(url: string) {
  return fetch(url).then((res) => res.blob());
}
