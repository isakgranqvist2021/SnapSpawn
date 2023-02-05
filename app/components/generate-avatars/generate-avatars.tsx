import { Characteristic, Gender, Traits } from '@aa/models/prompt.model';

import { AgeRangePicker } from './age-range-picker';
import { GenerateAvatarSubmitButton } from './generate-avatar-submit-button';
import { useGenerateAvatar } from './generate-avatars.helpers';
import { PickCharacteristics } from './pick-characteristics';
import { PickGender } from './pick-gender';
import { PickTraits } from './pick-traits';

export function GenerateAvatarForm() {
  const { dispatch, generateAvatars, isLoading, state } = useGenerateAvatar();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    generateAvatars();
  };

  const onAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      age: parseInt(e.target.value),
      type: 'set:age',
    });
  };

  const onGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      gender: e.target.value as Gender,
      type: 'set:gender',
    });
  };

  const onTraitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      traits: e.target.value as Traits,
      type: 'set:traits',
    });
  };

  const onCharacteristicsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      characteristics: e.target.value as Characteristic,
      type: 'set:characteristics',
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="p-5">
        <AgeRangePicker
          isLoading={isLoading}
          onChange={onAgeChange}
          value={state.age}
        />
      </div>

      <hr />

      <div className="p-5">
        <PickGender
          isLoading={isLoading}
          onChange={onGenderChange}
          value={state.gender}
        />
      </div>

      <hr />

      <div className="p-5">
        <PickTraits
          isLoading={isLoading}
          onChange={onTraitsChange}
          value={state.traits}
        />
      </div>

      <hr />

      <div className="p-5">
        <PickCharacteristics
          isLoading={isLoading}
          onChange={onCharacteristicsChange}
          value={state.characteristics}
        />
      </div>

      <hr />

      <div className="p-5">
        <GenerateAvatarSubmitButton isLoading={isLoading} />
      </div>
    </form>
  );
}
