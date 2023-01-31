import { Spinner } from '@aa/components/spinner';
import React, { useState } from 'react';

interface AddCreditsModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const getContainerClassName = (isOpen: boolean) => {
  const baseClassName = [
    'fixed inset-0 bg-slate-600 flex items-center justify-center ease-linear duration-100',
  ];

  if (isOpen) {
    return [...baseClassName, 'bg-opacity-75', 'pointer-events-auto'].join(' ');
  }

  return [baseClassName, 'bg-opacity-0 pointer-events-none'].join(' ');
};

const getContentClassName = (isOpen: boolean) => {
  const baseClassName = [
    'bg-white max-w-md w-1/2 p-4 rounded ease-linear duration-100',
  ];

  if (isOpen) {
    return [...baseClassName, 'scale-1'].join(' ');
  }

  return [baseClassName, 'scale-0'].join(' ');
};

function AddCreditsModal(props: AddCreditsModalProps) {
  const { closeModal, isOpen } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState(10);

  const preventPropagation = (e: React.MouseEvent) => e.stopPropagation();

  const continueToCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);

    e.preventDefault();

    await fetch('/api/credits/buy-credits', {
      method: 'POST',
      body: JSON.stringify({ credits }),
    });

    setIsLoading(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredits(parseInt(e.target.value));
  };

  return (
    <div className={getContainerClassName(isOpen)} onClick={closeModal}>
      <div className={getContentClassName(isOpen)} onClick={preventPropagation}>
        <h3 className="text-lg font-semibold mb-3">Add avatar credits</h3>

        <form onSubmit={continueToCheckout}>
          <div className="flex flex-col gap-3">
            <label
              htmlFor="10"
              className="flex items-center gap-2 text-base hover:text-green-600 cursor-pointer"
            >
              10 credits for $1
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
              50 credits for $5
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
              100 credits for $10
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
            className="bg-green-800 px-3 py-2 rounded text-white hover:bg-green-700 mt-3 disabled:opacity-20 disabled:pointer-events-none"
          >
            {isLoading ? <Spinner /> : 'Continue to checkout'}
          </button>
        </form>
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
        className="bg-green-800 px-3 py-2 rounded text-white hover:bg-green-700"
      >
        Add credits
      </button>

      <AddCreditsModal closeModal={closeAddCreditsModal} isOpen={isOpen} />
    </React.Fragment>
  );
}
