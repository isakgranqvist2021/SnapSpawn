import { Spinner } from '@aa/components/spinner';
import React from 'react';

import { useAddCreditsModal } from './add-credits.helpers';

export function AddCreditsForm() {
  const { continueToCheckout, credits, isLoading, onChange } =
    useAddCreditsModal();

  return (
    <form className="max-w-fit" onSubmit={continueToCheckout}>
      <div className="pb-5">
        <h1 className="text-3xl leading-10">Add Credits</h1>
        <p className="max-w-prose">
          You can add credits to your account to generate more avatars. Credits
          will be added to your account after the payment has been completed.
        </p>
      </div>

      <hr />

      <div className="p-5">
        <div className="form-control">
          <label htmlFor="10" className="label cursor-pointer">
            <span className="label-text">10 credits for €1</span>
            <input
              checked={credits === 10}
              className="radio"
              disabled={isLoading}
              id="10"
              name="credits"
              onChange={onChange}
              type="radio"
              value={10}
            />
          </label>
        </div>

        <div className="form-control">
          <label htmlFor="50" className="label cursor-pointer">
            <span className="label-text">50 credits for €4.5</span>
            <input
              checked={credits === 50}
              className="radio"
              disabled={isLoading}
              id="50"
              name="credits"
              onChange={onChange}
              type="radio"
              value={50}
            />
          </label>
        </div>

        <div className="form-control">
          <label htmlFor="100" className="label cursor-pointer">
            <span className="label-text">100 credits for €8</span>
            <input
              checked={credits === 100}
              className="radio"
              disabled={isLoading}
              id="100"
              name="credits"
              onChange={onChange}
              type="radio"
              value={100}
            />
          </label>
        </div>
      </div>

      <hr />

      <div className="py-5 flex justify-end">
        <button disabled={isLoading} type="submit" className="btn btn-primary">
          {isLoading && (
            <div className="absolute z-10">
              <Spinner color="stroke-white" />
            </div>
          )}

          <span className={isLoading ? 'opacity-0' : ''}>
            Continue to checkout
          </span>
        </button>
      </div>
    </form>
  );
}
