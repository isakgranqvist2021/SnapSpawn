import { useApiState } from '@aa/context/api-context';
import { Characteristic, characteristics } from '@aa/models';

import {
  useGenerateAvatarDispatch,
  useGenerateAvatarState,
} from '../generate-avatars.context';

export function PickCharacteristics() {
  const state = useGenerateAvatarState();
  const dispatch = useGenerateAvatarDispatch();

  const { isLoading } = useApiState().avatars;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      characteristics: e.target.value as Characteristic,
      type: 'set:characteristics',
    });
  };

  const renderCharacteristicButton = (characteristic: Characteristic) => {
    const isChecked = state.characteristics.includes(characteristic);

    return (
      <div className="form-control" key={characteristic}>
        <label className="label cursor-pointer">
          <span
            className={`label-text capitalize ${
              isChecked ? 'text-primary' : ''
            }`}
          >
            {characteristic}
          </span>
          <input
            disabled={isLoading}
            onChange={onChange}
            value={characteristic}
            type="radio"
            className="radio"
            checked={isChecked}
          />
        </label>
      </div>
    );
  };

  return (
    <div className="grid gap-2 grid-cols-2">
      {characteristics.map(renderCharacteristicButton)}
    </div>
  );
}
