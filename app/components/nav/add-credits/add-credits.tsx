import {
  Modal,
  ModalBody,
  ModalContainer,
  ModalFooter,
  ModalHeader,
} from '@aa/components/modal';
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

const MODAL_ID = 'ADD_CREDITS_MODAL';

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

export function AddCreditsModal() {
  const { continueToCheckout, credits, isLoading, modalToggleRef, onChange } =
    useAddCreditsModal();

  return (
    <Modal id={MODAL_ID} ref={modalToggleRef} title="Add Credits">
      <ModalContainer>
        <form onSubmit={continueToCheckout}>
          <ModalHeader title="Add Credits" />
          <ModalBody>
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
          </ModalBody>

          <ModalFooter>
            <AddCreditsSubmitButton isLoading={isLoading} />
          </ModalFooter>
        </form>
      </ModalContainer>
    </Modal>
  );
}

export function AddCreditsButton() {
  return (
    <label htmlFor={MODAL_ID} className="btn btn-primary">
      Add Credits
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
