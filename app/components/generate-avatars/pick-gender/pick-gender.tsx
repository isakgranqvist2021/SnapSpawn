import { useApiState } from '@aa/context/api-context';
import { Gender, genders } from '@aa/models';

import {
  useGenerateAvatarDispatch,
  useGenerateAvatarState,
} from '../generate-avatars.context';

export function PickGender() {
  const dispatch = useGenerateAvatarDispatch();
  const state = useGenerateAvatarState();

  const { isLoading } = useApiState().avatars;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ gender: e.target.value as Gender, type: 'set:gender' });
  };

  const renderGenderRadioButton = (gender: Gender) => {
    return (
      <div className="form-control" key={gender}>
        <label className="label cursor-pointer flex gap-4">
          <span
            className={`label-text capitalize ${
              state.form.gender === gender ? 'text-primary' : ''
            }`}
          >
            {gender}
          </span>
          <input
            onChange={onChange}
            value={gender}
            type="radio"
            disabled={isLoading || state.customPrompt !== null}
            className="radio"
            checked={state.form.gender === gender}
          />
        </label>
      </div>
    );
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {genders.map(renderGenderRadioButton)}
    </div>
  );
}
