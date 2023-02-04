import { Modal } from '@aa/components/modal';
import { characteristics, genders } from '@aa/utils/prompt';

import { AgeRangePicker } from './age-range-picker';
import { GenerateAvatarSubmitButton } from './generate-avatar-submit-button';
import { useGenerateAvatar } from './generate-avatars.helpers';
import { PickCharacteristics } from './pick-characteristics';
import { PickGender } from './pick-gender';

const MODAL_ID = 'GENERATE_AVATAR_MODAL';

export function GenerateAvatarModal() {
  const { state, isLoading, generateAvatars, dispatch } = useGenerateAvatar();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    generateAvatars();
  };

  const onAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'set:age', age: parseInt(e.target.value) });
  };

  const onGenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'set:gender',
      gender: e.target.value as (typeof genders)[number],
    });
  };

  const onCharacteristicsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'set:characteristics',
      characteristics: e.target.value as (typeof characteristics)[number],
    });
  };

  return (
    <Modal title="Generate Avatar" id={MODAL_ID}>
      <form onSubmit={onSubmit} className="px-4 py-3 flex flex-col gap-5 form">
        <div className="divider">Pick Age</div>
        <AgeRangePicker
          onChange={onAgeChange}
          value={state.age}
          isLoading={isLoading}
        />

        <div className="divider">Pick Gender</div>

        <PickGender
          onChange={onGenderChange}
          value={state.gender}
          isLoading={isLoading}
        />

        <div className="divider">Pick Characteristics</div>

        <PickCharacteristics
          onChange={onCharacteristicsChange}
          value={state.characteristics}
          isLoading={isLoading}
        />

        <GenerateAvatarSubmitButton isLoading={isLoading} />
      </form>
    </Modal>
  );
}

export function GenerateAvatarsButton() {
  return (
    <label htmlFor={MODAL_ID} className="btn btn-secondary">
      <span>Generate Avatar</span>
    </label>
  );
}

export function GenerateAvatarsBottomNavButton() {
  return (
    <label htmlFor={MODAL_ID}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
      <span className="btm-nav-label">Generate Avatar</span>
    </label>
  );
}
