import { Spinner } from '@aa/components/spinner';
import React from 'react';

import { useAddCreditsModal } from './add-credits.helpers';

interface CreditRadioButtonProps {
  credits: number;
  isLoading: boolean;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: number;
}

interface AddCreditsSubmitButtonProps {
  isLoading: boolean;
}

function CreditRadioButton(props: CreditRadioButtonProps) {
  const { credits, isLoading, label, onChange, value } = props;

  return (
    <div className="form-control">
      <label htmlFor={value.toString()} className="label cursor-pointer">
        <span className="label-text">{label}</span>
        <input
          checked={credits === 10}
          className="radio"
          disabled={isLoading}
          id={value.toString()}
          name="credits"
          onChange={onChange}
          type="radio"
          value={value.toString()}
        />
      </label>
    </div>
  );
}

function AddCreditsSubmitButton(props: AddCreditsSubmitButtonProps) {
  const { isLoading } = props;

  return (
    <button
      disabled={isLoading}
      type="submit"
      className="btn btn-primary w-full"
    >
      {isLoading && (
        <div className="absolute z-10">
          <Spinner color="stroke-white" />
        </div>
      )}

      <span className={isLoading ? 'opacity-0' : ''}>Continue to checkout</span>
    </button>
  );
}

export function AddCreditsForm() {
  const { continueToCheckout, credits, isLoading, modalToggleRef, onChange } =
    useAddCreditsModal();

  return (
    <form onSubmit={continueToCheckout}>
      <div className="p-5">
        <CreditRadioButton
          credits={credits}
          isLoading={isLoading}
          label="10 credits for €1"
          value={10}
          onChange={onChange}
        />

        <CreditRadioButton
          credits={credits}
          isLoading={isLoading}
          label="50 credits for €4.5"
          value={50}
          onChange={onChange}
        />

        <CreditRadioButton
          credits={credits}
          isLoading={isLoading}
          label="100 credits for €8"
          value={100}
          onChange={onChange}
        />
      </div>

      <hr />

      <div className="p-5">
        <AddCreditsSubmitButton isLoading={isLoading} />
      </div>
    </form>
  );
}
