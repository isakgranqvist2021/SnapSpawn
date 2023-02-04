import { Modal } from '@aa/components/modal';
import { Characteristic, Gender } from '@aa/models/prompt.model';

import { AgeRangePicker } from './age-range-picker';
import { GenerateAvatarSubmitButton } from './generate-avatar-submit-button';
import { useGenerateAvatar } from './generate-avatars.helpers';
import { PickCharacteristics } from './pick-characteristics';
import { PickGender } from './pick-gender';

const MODAL_ID = 'GENERATE_AVATAR_MODAL';

export function GenerateAvatarModal() {
  const { dispatch, generateAvatars, isLoading, modalToggleRef, state } =
    useGenerateAvatar();

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

  const onCharacteristicsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      characteristics: e.target.value as Characteristic,
      type: 'set:characteristics',
    });
  };

  return (
    <Modal ref={modalToggleRef} title="Generate Avatar" id={MODAL_ID}>
      <form onSubmit={onSubmit} className="px-4 py-3 flex flex-col gap-5 form">
        <div className="divider">Pick Age</div>
        <AgeRangePicker
          isLoading={isLoading}
          onChange={onAgeChange}
          value={state.age}
        />

        <div className="divider">Pick Gender</div>

        <PickGender
          isLoading={isLoading}
          onChange={onGenderChange}
          value={state.gender}
        />

        <div className="divider">Pick Characteristics</div>

        <PickCharacteristics
          isLoading={isLoading}
          onChange={onCharacteristicsChange}
          value={state.characteristics}
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
    <label className="text-secondary" htmlFor={MODAL_ID}>
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
          d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
        />
      </svg>
    </label>
  );
}
