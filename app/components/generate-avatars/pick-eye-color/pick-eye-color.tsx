import { EyeColor, eyeColors } from '@aa/models';

import {
  useGenerateAvatarDispatch,
  useGenerateAvatarState,
} from '../generate-avatars.context';

export function PickEyeColor() {
  const state = useGenerateAvatarState();
  const dispatch = useGenerateAvatarDispatch();

  const value = state.form.eyeColor;
  const isLoading = state.isLoading;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      eyeColor: e.target.value as EyeColor,
      type: 'set:eyeColor',
    });
  };

  const renderEyeColorButton = (eyeColor: EyeColor) => {
    return (
      <div className="form-control" key={eyeColor}>
        <label className="label cursor-pointer">
          <span
            className={`label-text capitalize ${
              value.includes(eyeColor) ? 'text-primary' : ''
            }`}
          >
            {eyeColor} eyes
          </span>
          <input
            onChange={onChange}
            value={eyeColor}
            type="radio"
            disabled={isLoading}
            className="radio"
            checked={value.includes(eyeColor)}
          />
        </label>
      </div>
    );
  };

  return (
    <div className="grid gap-2 grid-cols-2">
      {eyeColors.map(renderEyeColorButton)}
    </div>
  );
}
