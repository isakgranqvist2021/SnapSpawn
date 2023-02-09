import { NODE_ENV } from '@aa/config';
import { GetServerSidePropsContext } from 'next';
import { NextResponse } from 'next/server';
import { useState } from 'react';

export default function Testing() {
  const [urls, setUrls] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const runPrompt = async () => {
    setLoading(true);

    const body: BodyInit = JSON.stringify({
      prompt,
    });

    const requestInit: RequestInit = {
      method: 'POST',
      body,
    };

    const res = await fetch('/api/testing', requestInit);
    const data = await res.json();

    if (Array.isArray(data.urls)) {
      setUrls(data.urls);
    }

    setLoading(false);
  };

  return (
    <div className="bg-base-200 w-screen h-screen overflow-hidden">
      <div className="flex flex-col gap-3 p-5 w-72">
        <textarea
          className="textarea border resize"
          disabled={loading}
          id=""
          name=""
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt to generate pictures"
        ></textarea>
        <button
          className="btn btn-primary"
          disabled={loading}
          onClick={runPrompt}
        >
          Run prompt
        </button>
      </div>

      <div className="overflow-auto flex flex-wrap gap-3 px-5 pb-5">
        {urls.map((url) => (
          <img key={url} src={url} alt="" />
        ))}
      </div>
    </div>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  if (NODE_ENV === 'production') {
    return NextResponse.redirect('/account');
  }

  return {
    props: {},
  };
}
