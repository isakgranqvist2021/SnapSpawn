import { Spinner } from '@aa/components/spinner';
import { AppContext } from '@aa/context';
import { useAddCredits } from '@aa/hooks/use-add-credits';
import { FormEvent, useContext, useState } from 'react';

export function AddCreditsForm() {
  const appContext = useContext(AppContext);

  const [credits, setCredits] = useState(100);

  const addCredits = useAddCredits();

  const continueToCheckout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addCredits(credits);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredits(parseInt(e.target.value));
  };

  const getCheckoutButtonText = () => {
    if (appContext.state.credits.isLoading) {
      return 'Loading...';
    }

    if (!credits) {
      return 'Please enter a number';
    }

    if (credits < 20) {
      return 'Minimum 20 credits';
    }

    if (credits > 10000) {
      return 'Maximum 10000 credits';
    }

    return `Continue to checkout €${credits / 20}`;
  };

  return (
    <form onSubmit={continueToCheckout} className="flex flex-col">
      <label className="label">Number of credits</label>

      <div className="flex gap-5 flex-wrap">
        <input
          type="number"
          value={credits}
          onChange={onChange}
          className="input input-bordered w-full"
          min={20}
          max={10000}
        />

        <button
          disabled={
            appContext.state.credits.isLoading ||
            !credits ||
            credits < 20 ||
            credits > 10000
          }
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
            {getCheckoutButtonText()}
          </span>
        </button>
      </div>
    </form>
  );
}
