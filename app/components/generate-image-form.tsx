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

  const fileUploadRef = React.useRef<HTMLInputElement | null>(null);

  if (!appContext.state.credits.data) {
    return null;
  }

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
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="relative w-full">
          <textarea
            autoFocus
            maxLength={MAX_LENGTH}
            className="textarea textarea-bordered h-32 resize-y w-full pr-32 pb-10"
            disabled={disableForm}
            onChange={onChange}
            placeholder="Enter prompt here"
            value={prompt}
            style={{ paddingBottom: '3.5rem', paddingRight: '8rem' }}
          ></textarea>

          <span
            className="absolute bottom-2 left-4 text-xs px-2 py-1"
            style={{ pointerEvents: 'none' }}
          >
            {prompt.length}/{MAX_LENGTH}
          </span>

          <div className="absolute bottom-2 right-4 flex items-center gap-2">
            <label>
              <input
                disabled={isLoading}
                onChange={onFileInputChange}
                type="file"
                className="hidden"
                ref={fileUploadRef}
              />
              <button
                type="button"
                className="btn btn-outline btn-xs font-bold px-4 py-1 rounded shadow"
                style={{
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  minWidth: '80px',
                }}
                disabled={isLoading}
                tabIndex={-1}
                onClick={() => fileUploadRef.current?.click()}
              >
                Upload
              </button>
            </label>
            <button
              className="btn btn-secondary btn-xs font-bold px-4 py-1 rounded shadow relative"
              disabled={disableForm || !prompt.length}
              type="submit"
              style={{ minWidth: '80px' }}
            >
              {appContext.state.avatars.isLoading && (
                <span className="absolute">
                  <Spinner />
                </span>
              )}
              <span
                className={
                  appContext.state.avatars.isLoading ? 'opacity-0' : ''
                }
              >
                Generate
              </span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
