import { useApiState } from '@aa/context/api-context';
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

  return (
    <h1 className="text-3xl">
      You have <span className="text-secondary">{state.credits.data}</span>{' '}
      credits
    </h1>
  );
}

function CustomPromptTextarea() {
  const state = useGenerateAvatarState();
  const dispatch = useGenerateAvatarDispatch();
  const apiState = useApiState();

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'set:custom-prompt', customPrompt: e.target.value });
  };

  return (
    <textarea
      className="textarea textarea-bordered h-24 resize w-full"
      disabled={apiState.avatars.isLoading}
      onChange={onChange}
      placeholder="Enter custom prompt here"
      value={state.customPrompt ?? ''}
    ></textarea>
  );
}

function _GenerateAvatarsFormContent() {
  const generateAvatars = useGenerateAvatar();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    generateAvatars();
  };

  return (
    <form className="max-w-4xl" onSubmit={onSubmit}>
      <UserCreditsText />

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

      <div className="divider">or enter a custom prompt</div>

      <FormSection>
        <CustomPromptTextarea />
      </FormSection>

      <hr />

      <div className="p-5 flex justify-end">
        <GenerateAvatarSubmitButton />
      </div>
    </form>
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
    <div className="flex flex-wrap gap-5 px-5 justify-center">
      {state.result.map(renderAvatar)}
    </div>
  );
};

export function GenerateAvatarsForm() {
  return (
    <GenerateAvatarProvider>
      <div className="p-5 flex flex-col gap-5 w-full">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link href="/account">My Avatars</Link>
            </li>
            <li>
              <Link href="/create">Generate Avatar</Link>
            </li>
          </ul>
        </div>

        <GenerateAvatarsFormContent />

        <AvatarGenerationResult />
      </div>
    </GenerateAvatarProvider>
  );
}
