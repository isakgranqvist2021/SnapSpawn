import { Modal } from '@aa/components/modal';
import { Spinner } from '@aa/components/spinner';
import { useAppState } from '@aa/context';
import React from 'react';

import { useAddCreditsModal } from './add-credits.helpers';

interface CreditRadioButtonProps {
  credits: number;
  isLoading: boolean;
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface AddCreditsSubmitButtonProps {
  isLoading: boolean;
}

const MODAL_ID = 'ADD_CREDITS_MODAL';

function CreditRadioButton(props: CreditRadioButtonProps) {
  const { credits, label, value, onChange, isLoading } = props;

  return (
    <div className="form-control">
      <label htmlFor={value.toString()} className="label cursor-pointer">
        <span className="label-text">{label}</span>
        <input
          className="radio"
          onChange={onChange}
          type="radio"
          id={value.toString()}
          disabled={isLoading}
          name="credits"
          value={value.toString()}
          checked={credits === 10}
        />
      </label>
    </div>
  );
}

function AddCreditsSubmitButton(props: AddCreditsSubmitButtonProps) {
  const { isLoading } = props;

  return (
    <button disabled={isLoading} type="submit" className="btn btn-primary mt-3">
      {isLoading && (
        <div className="absolute z-10">
          <Spinner color="stroke-white" />
        </div>
      )}

      <span className={isLoading ? 'opacity-0' : ''}>Continue to checkout</span>
    </button>
  );
}

export function AddCreditsModal() {
  const { credits, isLoading, onChange, continueToCheckout, modalToggleRef } =
    useAddCreditsModal();

  return (
    <Modal ref={modalToggleRef} title="Add Credits" id={MODAL_ID}>
      <form onSubmit={continueToCheckout} className="px-4 py-3">
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

        <AddCreditsSubmitButton isLoading={isLoading} />
      </form>
    </Modal>
  );
}

export function AddCreditsButton() {
  const appState = useAppState();

  return (
    <label htmlFor={MODAL_ID} className="btn btn-primary">
      Add Credits ({appState.credits})
    </label>
  );
}

export function AddCreditsBottomNavButton() {
  return (
    <label className="text-primary" htmlFor={MODAL_ID}>
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
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </label>
  );
}
