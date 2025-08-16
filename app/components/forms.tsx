import { AppContext } from '@aa/context';
import { useGenerateImage } from '@aa/hooks/use-generate-avatar';
import { useUploadFiles } from '@aa/hooks/use-upload-files';
import React from 'react';

import { Spinner } from './spinner';

const MAX_LENGTH = 1000;

export function GenerateImageForm() {
  const appContext = React.useContext(AppContext);
  const generateCustomPicture = useGenerateImage();
  const uploadFiles = useUploadFiles();

  const [prompt, setPrompt] = React.useState('');

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length >= MAX_LENGTH) {
      e.target.value = e.target.value.slice(0, MAX_LENGTH);
    }

    setPrompt(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    window.scrollTo(0, 0);

    generateCustomPicture(prompt);
  };

  const isLoading =
    appContext.state.avatars.isLoading || appContext.state.upload.isLoading;
  const disableForm = isLoading || !appContext.state.credits.data;

  const onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    await uploadFiles(e.target.files);

    e.target.value = '';
  };

  return (
    <div className="w-full p-5">
      <form
        className="flex flex-col gap-5 p-5 shadow-lg rounded-lg"
        onSubmit={handleSubmit}
      >
        <input disabled={isLoading} onChange={onFileInputChange} type="file" />

        <div className="form-control">
          <textarea
            autoFocus
            maxLength={MAX_LENGTH}
            className="textarea textarea-bordered h-24 resize-y w-full"
            disabled={disableForm}
            onChange={onChange}
            placeholder="Enter prompt here"
            value={prompt}
          ></textarea>
          <label className="label justify-end">
            <span className="label-text-alt">
              {prompt.length ?? 0}/{MAX_LENGTH}
            </span>
          </label>
        </div>

        <button
          className="btn btn-secondary btn-sm relative ml-auto"
          disabled={disableForm}
          type="submit"
        >
          {appContext.state.avatars.isLoading && (
            <div className="absolute z-10">
              <Spinner />
            </div>
          )}

          <span
            className={appContext.state.avatars.isLoading ? 'opacity-0' : ''}
          >
            Generate
          </span>
        </button>
      </form>
    </div>
  );
}
