import { useApiState } from '@aa/context/api-context';
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

  return (
    <h1 className="text-3xl mt-3">
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

function _GenerateAvatarsFormContent() {
  return (
    <React.Fragment>
      <FormSection>
        <PickGender />
      </FormSection>

      <hr />

      <FormSection>
        <PickTraits />
      </FormSection>

      <hr />

      <FormSection>
        <PickCharacteristics />
      </FormSection>

      <div className="p-5 flex justify-center">
        <GenerateAvatarSubmitButton text="Generate Avatar" />
      </div>
    </React.Fragment>
  );
}

function CustomPromptForm() {
  return (
    <div className="flex flex-col items-center w-full">
      <FormSection>
        <CustomPromptTextarea />
      </FormSection>

      <div className="p-5 flex justify-ceneter">
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

function Form(props: { mode: 'generate' | 'custom' }) {
  const { mode } = props;

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

export function GenerateAvatarsForm() {
  const [mode, setMode] = React.useState<'custom' | 'generate'>('generate');

  const setModeAsCustom = () => setMode('custom');
  const setModeAsGenerate = () => setMode('generate');

  return (
    <GenerateAvatarProvider>
      <div className="p-5 flex flex-col gap-5 w-full items-center">
        <div className="tabs">
          <a
            onClick={setModeAsGenerate}
            className={[
              'tab tab-lg tab-lifted',
              mode === 'generate' ? 'tab-active' : '',
            ].join(' ')}
          >
            Generate
          </a>
          <a
            onClick={setModeAsCustom}
            className={[
              'tab tab-lg tab-lifted',
              mode === 'custom' ? 'tab-active' : '',
            ].join(' ')}
          >
            Custom
          </a>
        </div>

        <UserCreditsText />

        <Form mode={mode} />
      </div>

      <AvatarGenerationResult />
    </GenerateAvatarProvider>
  );
}
