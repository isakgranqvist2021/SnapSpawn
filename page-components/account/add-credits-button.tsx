import { Modal } from '@aa/components/modal';
import { Spinner } from '@aa/components/spinner';
import getStripe from '@aa/services/stripe';
import { getButtonClassName } from '@aa/utils/styles';
import React, { useState } from 'react';

interface AddCreditsModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

function AddCreditsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState(10);

  const continueToCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const stripe = await getStripe();

    if (!stripe) {
      setIsLoading(false);
      return;
    }

    const res = await fetch('/api/checkout_sessions', {
      method: 'POST',
      body: JSON.stringify({ credits }),
    }).then((res) => res.json());

    await stripe.redirectToCheckout({
      sessionId: res.id,
    });

    setIsLoading(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredits(parseInt(e.target.value));
  };

  return (
    <form onSubmit={continueToCheckout} className="px-4 py-3">
      <div className="flex flex-col gap-3">
        <label
          htmlFor="10"
          className="flex items-center gap-2 text-base hover:text-green-600 cursor-pointer"
        >
          10 credits for €1
          <input
            onChange={onChange}
            type="radio"
            id="10"
            name="credits"
            value="10"
            checked={credits === 10}
          />
        </label>

        <label
          htmlFor="50"
          className="flex items-center gap-2 text-base hover:text-green-600 cursor-pointer"
        >
          50 credits for €4.5
          <input
            onChange={onChange}
            type="radio"
            id="50"
            name="credits"
            value="50"
            checked={credits === 50}
          />
        </label>

        <label
          htmlFor="100"
          className="flex items-center gap-2 text-base hover:text-green-600 cursor-pointer"
        >
          100 credits for €8
          <input
            onChange={onChange}
            type="radio"
            id="100"
            name="credits"
            value="100"
            checked={credits === 100}
          />
        </label>
      </div>

      <button
        disabled={isLoading}
        type="submit"
        className={getButtonClassName({
          bgColor: 'bg-green-800',
          textColor: 'text-white',
          hoverBgColor: 'bg-green-700',
          className: 'mt-4',
        })}
      >
        {isLoading && (
          <div className="absolute z-10">
            <Spinner color="stroke-white" />
          </div>
        )}

        <span className={isLoading ? 'opacity-0' : ''}>
          Continue to checkout
        </span>
      </button>
    </form>
  );
}

export function AddCreditsButton() {
  const [isOpen, setIsOpen] = useState(false);

  const openAddCreditsModal = () => setIsOpen(true);
  const closeAddCreditsModal = () => setIsOpen(false);

  return (
    <React.Fragment>
      <button
        onClick={openAddCreditsModal}
        className={getButtonClassName({
          bgColor: 'bg-green-800',
          textColor: 'text-white',
          hoverBgColor: 'bg-green-700',
        })}
      >
        Add credits
      </button>

      <Modal onClose={closeAddCreditsModal} isOpen={isOpen}>
        <div className="border-b px-4 py-3">
          <h3 className="text-lg font-semibold">Add avatar credits</h3>
          <p className="text-green-600 text-sm">1 credit = 1 avatar</p>
        </div>

        <AddCreditsForm />
      </Modal>
    </React.Fragment>
  );
}
