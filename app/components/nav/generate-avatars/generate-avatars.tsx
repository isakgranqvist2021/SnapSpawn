import { Modal } from '@aa/components/modal';

import { useGenerateAvatar } from './generate-avatars.helpers';

const MODAL_ID = 'GENERATE_AVATAR_MODAL';

export function GenerateAvatarModal() {
  return (
    <Modal title="Generate Avatar" id={MODAL_ID}>
      Modal
    </Modal>
  );
}

export function GenerateAvatarsButton() {
  return (
    <label htmlFor={MODAL_ID} className="btn btn-secondary hidden md:flex">
      <span>Generate Avatar</span>
    </label>
  );
}

export function GenerateAvatarListItem() {
  return (
    <li className="md:hidden">
      <label htmlFor={MODAL_ID}>Generate Avatar</label>
    </li>
  );
}
