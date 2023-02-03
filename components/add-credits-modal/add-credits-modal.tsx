import { Modal } from '@aa/components/modal';
import { Spinner } from '@aa/components/spinner';
import getStripe from '@aa/services/stripe';
import React, { useState } from 'react';

interface AddCreditsModalProps {
  id: string;
}

export function AddCreditsModal(props: AddCreditsModalProps) {
  const { id } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState(10);

  const continueToCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
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
    } catch {
      setIsLoading(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredits(parseInt(e.target.value));
  };

  return (
    <Modal title="Add Credits" id={id}>
      <form onSubmit={continueToCheckout} className="px-4 py-3">
        <div className="form-control">
          <label htmlFor="10" className="label cursor-pointer">
            <span className="label-text">10 credits for €1</span>
            <input
              className="radio"
              onChange={onChange}
              type="radio"
              id="10"
              disabled={isLoading}
              name="credits"
              value="10"
              checked={credits === 10}
            />
          </label>
        </div>

        <div className="form-control">
          <label className="label cursor-pointer" htmlFor="50">
            <span className="label-text">50 credits for €4.5</span>
            <input
              className="radio"
              onChange={onChange}
              type="radio"
              id="50"
              name="credits"
              disabled={isLoading}
              value="50"
              checked={credits === 50}
            />
          </label>
        </div>

        <div className="form-control">
          <label htmlFor="100" className="label cursor-pointer">
            <span className="label-text">100 credits for €8</span>
            <input
              onChange={onChange}
              disabled={isLoading}
              type="radio"
              id="100"
              className="radio"
              name="credits"
              value="100"
              checked={credits === 100}
            />
          </label>
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="btn btn-primary mt-3"
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
    </Modal>
  );
}
