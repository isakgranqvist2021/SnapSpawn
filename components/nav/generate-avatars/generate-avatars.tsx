import { Spinner } from '@aa/components/spinner';

import { useGenerateAvatar } from './generate-avatars.helpers';

export function GenerateAvatarsButton() {
  const { credits, generateAvatars, isLoading } = useGenerateAvatar();

  return (
    <button
      className="btn btn-secondary hidden md:flex"
      onClick={generateAvatars}
      disabled={credits === 0 || isLoading}
    >
      {isLoading && (
        <div className="absolute z-10">
          <Spinner color="stroke-white" />
        </div>
      )}

      <span className={isLoading ? 'opacity-0' : ''}>Generate Avatar</span>
    </button>
  );
}

export function GenerateAvatarListItem() {
  const { credits, generateAvatars, isLoading } = useGenerateAvatar();

  const disabled = credits === 0 || isLoading;

  return (
    <li className="md:hidden">
      <a
        onClick={generateAvatars}
        className={disabled ? 'pointer-events-none opacity-50' : undefined}
      >
        {disabled ? 'Loading...' : 'Generate Avatar'}
      </a>
    </li>
  );
}
