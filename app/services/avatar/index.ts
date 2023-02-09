import { OPEN_AI_API_KEY, OPEN_AI_BASE_URL } from '@aa/config';

import { Logger } from '../logger';

interface ApiResponse {
  created: number;
  data: { url: string }[];
}

declare const sizes: ['256x256', '512x512', '1024x1024x'];
type Size = (typeof sizes)[number];

const maxN = 10;
const minN = 1;

export async function generateAvatars(
  prompt: string,
  size: Size = '256x256',
  n = 1,
) {
  try {
    if (n > maxN) {
      throw new Error(`n must be less than ${maxN}`);
    }

    if (n < minN) {
      throw new Error(`n must be greater than ${minN}`);
    }

    const requestInit: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPEN_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, n, size }),
    };

    const response: ApiResponse = await fetch(
      OPEN_AI_BASE_URL,
      requestInit,
    ).then((res) => res.json());

    console.log(response);

    return response.data.map((obj) => obj.url);
  } catch (err) {
    Logger.log('error', err);
    return null;
  }
}

export function getImageFromUrl(url: string) {
  return fetch(url).then((res) => res.blob());
}
