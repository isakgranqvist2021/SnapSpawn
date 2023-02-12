import { useApiState } from '@aa/context/api-context';
import { Characteristic, characteristics } from '@aa/models';
import React from 'react';

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
    const isChecked = state.form.characteristics === characteristic;

    return (
      <div className="form-control" key={characteristic}>
        <label className="label cursor-pointer gap-2">
          <span
            className={`label-text capitalize ${
              isChecked ? 'text-primary' : ''
            }`}
          >
            {characteristic}
          </span>
          <input
            disabled={isLoading || state.customPrompt !== null}
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
    <React.Fragment>
      {characteristics.map(renderCharacteristicButton)}
    </React.Fragment>
  );
}
