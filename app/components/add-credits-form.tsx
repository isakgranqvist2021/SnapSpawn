import { Spinner } from '@aa/components/spinner';
import { AppContext } from '@aa/context';
import getStripe from '@aa/services/stripe';
import { FormEvent, useContext, useState } from 'react';

export function AddCreditsForm() {
  const appContext = useContext(AppContext);

  const [credits, setCredits] = useState(10);

  const continueToCheckout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      appContext.dispatch({ type: 'credits:set-is-loading', isLoading: true });

      const stripe = await getStripe();

      if (!stripe) {
        throw new Error('Stripe is not loaded');
      }

      const res = await fetch('/api/checkout_sessions', {
        body: JSON.stringify({ credits }),
        method: 'POST',
      }).then((res) => res.json());

      await stripe.redirectToCheckout({
        sessionId: res.id,
      });
    } catch {
      appContext.dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'error',
          message: 'Something went wrong. Please try again later.',
        },
      });
      appContext.dispatch({ type: 'credits:set-is-loading', isLoading: false });
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredits(parseInt(e.target.value));
  };

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
              disabled={appContext.state.credits.isLoading}
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
              disabled={appContext.state.credits.isLoading}
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
              disabled={appContext.state.credits.isLoading}
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
        <button
          disabled={appContext.state.credits.isLoading}
          type="submit"
          className="btn btn-primary"
        >
          {appContext.state.credits.isLoading && (
            <div className="absolute z-10">
              <Spinner />
            </div>
          )}

          <span
            className={appContext.state.credits.isLoading ? 'opacity-0' : ''}
          >
            Continue to checkout
          </span>
        </button>
      </div>
    </form>
  );
}
