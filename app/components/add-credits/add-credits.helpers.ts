import { useAppDispatch } from '@aa/context';
import getStripe from '@aa/services/stripe';
import { useState } from 'react';

export function useAddCreditsModal() {
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState(10);

  const appDispatch = useAppDispatch();

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
        body: JSON.stringify({ credits }),
        method: 'POST',
      }).then((res) => res.json());

      await stripe.redirectToCheckout({
        sessionId: res.id,
      });

      appDispatch({
        alert: {
          message: 'You have successfully purchased credits!',
          severity: 'success',
        },
        type: 'add:alert',
      });

      setIsLoading(false);
    } catch {
      appDispatch({
        alert: {
          message: 'Something went wrong. Please try again.',
          severity: 'error',
        },
        type: 'add:alert',
      });
      setIsLoading(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredits(parseInt(e.target.value));
  };

  return {
    continueToCheckout,
    credits,
    isLoading,
    onChange,
  };
}
