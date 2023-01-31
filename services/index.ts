import { API_KEY, BASE_URL } from '@aa/config';
import { formatBase64String } from '@aa/utils';

interface ApiResponse {
	created: number;
	data: { b64_json: string }[];
}

async function generateAvatars(prompt: string) {
	const response: ApiResponse = await fetch(BASE_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			prompt,
			n: 1,
			response_format: 'b64_json',
			size: '256x256',
		}),
	}).then((res) => res.json());

	const urls = response.data.map((obj) => formatBase64String(obj.b64_json));

	return urls;
}

export default generateAvatars;
