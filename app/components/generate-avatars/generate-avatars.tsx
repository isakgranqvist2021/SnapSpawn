import { memo } from 'react';

import { AgeRangePicker } from './age-range-picker';
import { GenerateAvatarSubmitButton } from './generate-avatar-submit-button';
import { GenerateAvatarProvider } from './generate-avatars.context';
import { useGenerateAvatar } from './generate-avatars.helpers';
import { PickCharacteristics } from './pick-characteristics';
import { PickEyeColor } from './pick-eye-color';
import { PickGender } from './pick-gender';
import { PickHairType } from './pick-hair-type';
import { PickTraits } from './pick-traits';

function _GenerateAvatarsForm() {
  const generateAvatars = useGenerateAvatar();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    generateAvatars();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="p-5">
        <AgeRangePicker />
      </div>

      <hr />

      <div className="p-5">
        <PickGender />
      </div>

      <hr />

      <div className="p-5">
        <PickHairType />
      </div>

      <hr />

      <div className="p-5">
        <PickEyeColor />
      </div>

      <hr />

      <div className="p-5">
        <PickTraits />
      </div>

      <hr />

      <div className="p-5">
        <PickCharacteristics />
      </div>

      <hr />

      <div className="p-5">
        <GenerateAvatarSubmitButton />
      </div>
    </form>
  );
}

const GenerateAvatarsForm = memo(_GenerateAvatarsForm);

export function GenerateAvatars() {
  return (
    <GenerateAvatarProvider>
      <GenerateAvatarsForm />
    </GenerateAvatarProvider>
  );
}
