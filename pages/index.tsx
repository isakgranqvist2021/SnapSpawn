import Head from 'next/head';
import React, { useState } from 'react';

function renderImage(url: string) {
	return <img src={url} alt='' />;
}

function Home() {
	const [urls, setUrls] = useState<string[]>([]);

	const generateAvatars = async () => {
		const res = await fetch('/api/generate-avatar').then((res) => res.json());

		setUrls(res.urls);
	};

	return (
		<React.Fragment>
			<Head>
				<title>Ai Avatar</title>
				<meta name='description' content='Ai avatar generator' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main>
				<button onClick={generateAvatars}>Generate Avatars</button>

				{urls.map(renderImage)}
			</main>
		</React.Fragment>
	);
}

export default Home;
