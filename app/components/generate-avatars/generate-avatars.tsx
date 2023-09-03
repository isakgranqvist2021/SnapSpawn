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
          const isSelected = prompt === state.customPrompt;

          const pickPredefinedPrompt = () => {
            if (apiState.avatars.isLoading) return;

            dispatch({ type: 'set:custom-prompt', customPrompt: prompt });
          };

          if (isSelected) {
            return (
              <div
                key={prompt}
                className={[
                  'badge badge-md text-white',
                  apiState.avatars.isLoading
                    ? 'opacity-50'
                    : 'bg-primary cursor-pointer',
                ].join(' ')}
                onClick={pickPredefinedPrompt}
              >
                {prompt}
              </div>
            );
          }

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

      <GenerateAvatarSubmitButton text="Generate Avatar" />
    </React.Fragment>
  );
}

function CustomPromptForm() {
  return (
    <div className="flex flex-col items-center">
      <FormSection>
        <CustomPromptTextarea />
      </FormSection>

      <GenerateAvatarSubmitButton text="Generate Custom Picture" />
    </div>
  );
}

const GenerateAvatarsFormContent = memo(_GenerateAvatarsFormContent);

function Form() {
  const { mode } = useGenerateAvatarState();

  const generateAvatars = useGenerateAvatar();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    generateAvatars();
  };

  return (
    <form className="max-w-4xl flex flex-col items-center" onSubmit={onSubmit}>
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
    <div className="flex gap-3 flex-wrap justify-center">
      <button
        className={
          mode === 'generate' ? 'btn btn-sm btn-outline' : 'btn btn-sm'
        }
        onClick={setModeAsGenerate}
      >
        Pre Defined Prompts
      </button>
      <button
        className={mode === 'custom' ? 'btn btn-sm btn-outline' : 'btn btn-sm'}
        onClick={setModeAsCustom}
      >
        Custom Prompt
      </button>
    </div>
  );
}

export function GenerateAvatarsForm() {
  return (
    <GenerateAvatarProvider>
      <div className="px-5 pb-5 pt-10 flex flex-col gap-5 w-full items-center">
        <a
          className="link link-primary"
          target="_blank"
          href="/The-DALL·E-2-prompt-book-v1.02.pdf"
        >
          The Dall-E prompt Book
        </a>

        <UserCreditsText />

        <TabHeader />

        <Form />
      </div>
    </GenerateAvatarProvider>
  );
}
