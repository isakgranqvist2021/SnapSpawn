import { Spinner } from '@aa/components/spinner';
import getStripe from '@aa/services/stripe';
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
        type="submit"
        disabled={isLoading}
        className="text-sm px-2 py-1 bg-green-800 rounded text-white hover:bg-green-700 mt-3 disabled:opacity-20 disabled:pointer-events-none"
      >
        {isLoading ? <Spinner /> : 'Continue to checkout'}
      </button>
    </form>
  );
}

function AddCreditsModal(props: AddCreditsModalProps) {
  const { closeModal, isOpen } = props;

  const preventPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className={[
        'fixed inset-0 bg-slate-600 flex items-center justify-center ease-linear duration-100 z-20',
        isOpen
          ? 'bg-opacity-75 pointer-events-auto'
          : 'bg-opacity-0 pointer-events-none',
      ].join(' ')}
      onClick={closeModal}
    >
      <div
        className={[
          'bg-white max-w-md w-1/2 rounded ease-linear duration-100',
          isOpen ? 'scale-1' : 'scale-0',
        ].join(' ')}
        onClick={preventPropagation}
      >
        <div className="border-b px-4 py-3">
          <h3 className="text-lg font-semibold">Add avatar credits</h3>
          <p className="text-green-600 text-sm">1 credit = 1 avatar</p>
        </div>

        <AddCreditsForm />
      </div>
    </div>
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
        className="bg-green-800 text-sm px-2 py-1 rounded text-white hover:bg-green-700"
      >
        Add credits
      </button>

      <AddCreditsModal closeModal={closeAddCreditsModal} isOpen={isOpen} />
    </React.Fragment>
  );
}
