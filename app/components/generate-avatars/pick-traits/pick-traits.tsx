import { useApiState } from '@aa/context/api-context';
import { Traits, traits } from '@aa/models';
import React from 'react';

import {
  useGenerateAvatarDispatch,
  useGenerateAvatarState,
} from '../generate-avatars.context';

export function PickTraits() {
  const dispatch = useGenerateAvatarDispatch();
  const state = useGenerateAvatarState();

  const { isLoading } = useApiState().avatars;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      traits: e.target.value as Traits,
      type: 'set:traits',
    });
  };

  const renderTraitButton = (trait: Traits) => {
    return (
      <div key={trait}>
        <label className="label cursor-pointer flex gap-2">
          <span
            className={`label-text capitalize ${
              state.form.traits === trait ? 'text-primary' : ''
            }`}
          >
            {trait}
          </span>
          <input
            onChange={onChange}
            value={trait}
            type="radio"
            disabled={isLoading}
            className="radio"
            checked={state.form.traits === trait}
          />
        </label>
      </div>
    );
  };

  return <React.Fragment>{traits.map(renderTraitButton)}</React.Fragment>;
}
