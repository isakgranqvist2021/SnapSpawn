import { HairType, hairTypes } from '@aa/models';

import {
  useGenerateAvatarDispatch,
  useGenerateAvatarState,
} from '../generate-avatars.context';

export function PickHairType() {
  const state = useGenerateAvatarState();
  const dispatch = useGenerateAvatarDispatch();

  const value = state.form.hairType;
  const isLoading = state.isLoading;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      hairType: e.target.value as HairType,
      type: 'set:hairType',
    });
  };

  const renderHairTypeButton = (hairType: HairType) => {
    return (
      <div className="form-control" key={hairType}>
        <label className="label cursor-pointer">
          <span
            className={`label-text capitalize ${
              value.includes(hairType) ? 'text-primary' : ''
            }`}
          >
            {hairType}
          </span>
          <input
            onChange={onChange}
            value={hairType}
            type="radio"
            disabled={isLoading}
            className="radio"
            checked={value.includes(hairType)}
          />
        </label>
      </div>
    );
  };

  return (
    <div className="grid gap-2 grid-cols-2">
      {hairTypes.map(renderHairTypeButton)}
    </div>
  );
}
