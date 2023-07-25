import { useApiState } from '@aa/context/api-context';
import { Size, avatarSizes } from '@aa/models';
import Link from 'next/link';
import React, { memo } from 'react';

import { FormSection } from './form-section';
import { GenerateAvatarSubmitButton } from './generate-avatar-submit-button';
import {
  GenerateAvatarProvider,
  useGenerateAvatarDispatch,
  useGenerateAvatarState,
} from './generate-avatars.context';
import { useGenerateAvatar } from './generate-avatars.helpers';
import { PickCharacteristics } from './pick-characteristics';
import { PickGender } from './pick-gender';
import { PickTraits } from './pick-traits';

function UserCreditsText() {
  const state = useApiState();

  if (!state.credits.data) {
    return (
      <h1 className="text-3xl mt-3 text-center">
        You have <span className="text-secondary">0</span> credits
        <Link className="ml-2 text-secondary" href="/refill">
          add some now!
        </Link>
      </h1>
    );
  }

  return (
    <h1 className="text-3xl mt-3 text-center">
      You have <span className="text-secondary">{state.credits.data}</span>{' '}
      credits
    </h1>
  );
}

const predefinedPrompts = [
  'earth reviving after human extinction',
  'Freeform ferrofluids, beautiful dark chaos',
  'a home built in a huge Soap bubble',
  'photo of an extremely cute alien fish',
  'a photo of a person who is a cat',
  'a photo of a person who is a dog',
  'a photo of a person who is a cat and a dog',
];

function CustomPromptTextarea() {
  const state = useGenerateAvatarState();
  const dispatch = useGenerateAvatarDispatch();
  const apiState = useApiState();

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'set:custom-prompt', customPrompt: e.target.value });
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <textarea
        className="textarea textarea-bordered h-24 resize w-full w-96"
        disabled={apiState.avatars.isLoading}
        onChange={onChange}
        placeholder="Enter custom prompt here"
        value={state.customPrompt ?? ''}
      ></textarea>

      <div className="flex gap-3 flex-wrap items-center max-w-4xl justify-center">
        {predefinedPrompts.map((prompt) => {
          const pickPredefinedPrompt = () => {
            if (apiState.avatars.isLoading) return;

            dispatch({ type: 'set:custom-prompt', customPrompt: prompt });
          };

          return (
            <div
              key={prompt}
              className={[
                'badge badge-md hover:text-white',
                apiState.avatars.isLoading
                  ? 'opacity-50'
                  : 'hover:bg-primary cursor-pointer',
              ].join(' ')}
              onClick={pickPredefinedPrompt}
            >
              {prompt}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PickMetaData() {
  const apiState = useApiState();
  const state = useGenerateAvatarState();
  const dispatch = useGenerateAvatarDispatch();

  const setN = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const n = parseInt(e.target.value);

    if (n > apiState.credits.data) {
      return;
    }

    dispatch({ type: 'set:n', n });
  };

  const setSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'set:size', size: e.target.value as Size });
  };

  return (
    <React.Fragment>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">How many to generate</span>
        </label>
        <select
          defaultValue={state.n}
          onChange={setN}
          className="select select-bordered w-full max-w-xs"
        >
          <option value={1}>1</option>
          {apiState.credits.data >= 2 && <option value={2}>2</option>}
          {apiState.credits.data >= 3 && <option value={3}>3</option>}
        </select>
      </div>

      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Size</span>
        </label>
        <select
          defaultValue={state.size}
          onChange={setSize}
          className="select select-bordered w-full max-w-xs"
        >
          {avatarSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
    </React.Fragment>
  );
}

function _GenerateAvatarsFormContent() {
  return (
    <React.Fragment>
      <FormSection>
        <PickGender />
      </FormSection>

      <div className="divider">Pick Accessory</div>

      <FormSection>
        <PickTraits />
      </FormSection>

      <div className="divider">Pick Theme</div>

      <FormSection>
        <PickCharacteristics />
      </FormSection>

      <div className="p-5 flex gap-5 flex-wrap justify-center items-end">
        <PickMetaData />
        <GenerateAvatarSubmitButton text="Generate Avatar" />
      </div>
    </React.Fragment>
  );
}

function CustomPromptForm() {
  return (
    <div className="flex flex-col">
      <FormSection>
        <CustomPromptTextarea />
      </FormSection>

      <div className="p-5 flex gap-5 flex-wrap justify-center">
        <PickMetaData />
        <GenerateAvatarSubmitButton text="Generate Custom Picture" />
      </div>
    </div>
  );
}

const GenerateAvatarsFormContent = memo(_GenerateAvatarsFormContent);

function renderAvatar(avatar: string, index: number) {
  return (
    <div key={index}>
      <img src={avatar} alt="avatar" />
    </div>
  );
}

const AvatarGenerationResult = () => {
  const state = useGenerateAvatarState();

  if (!state.result) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-5 px-5 pb-5 justify-center">
      {state.result.map(renderAvatar)}
    </div>
  );
};

function Form() {
  const { mode } = useGenerateAvatarState();

  const generateAvatars = useGenerateAvatar();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    generateAvatars();
  };

  return (
    <form className="max-w-4xl" onSubmit={onSubmit}>
      {mode === 'generate' ? (
        <GenerateAvatarsFormContent />
      ) : (
        <CustomPromptForm />
      )}
    </form>
  );
}

function TabHeader() {
  const { mode } = useGenerateAvatarState();
  const dispatch = useGenerateAvatarDispatch();

  const setModeAsCustom = () => {
    dispatch({ type: 'set:mode', mode: 'custom' });
  };

  const setModeAsGenerate = () => {
    dispatch({ type: 'set:mode', mode: 'generate' });
  };

  return (
    <div className="tabs">
      <a
        onClick={setModeAsGenerate}
        className={[
          'tab tab-lg tab-lifted',
          mode === 'generate' ? 'tab-active' : '',
        ].join(' ')}
      >
        Pre Defined Prompts
      </a>
      <a
        onClick={setModeAsCustom}
        className={[
          'tab tab-lg tab-lifted',
          mode === 'custom' ? 'tab-active' : '',
        ].join(' ')}
      >
        Custom Prompt
      </a>
    </div>
  );
}

export function GenerateAvatarsForm() {
  return (
    <GenerateAvatarProvider>
      <div className="p-5 flex flex-col gap-5 w-full items-center">
        <TabHeader />

        <UserCreditsText />

        <a
          className="link link-primary"
          target="_blank"
          href="/The-DALL·E-2-prompt-book-v1.02.pdf"
        >
          The Dall-E prompt Book
        </a>

        <Form />
      </div>

      <AvatarGenerationResult />
    </GenerateAvatarProvider>
  );
}
