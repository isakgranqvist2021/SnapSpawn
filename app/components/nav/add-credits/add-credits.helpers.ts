import { useAppDispatch } from '@aa/context';
import getStripe from '@aa/services/stripe';
import { useRef, useState } from 'react';

export function useAddCreditsModal() {
  const [isLoading, setIsLoading] = useState(false);
  const [credits, setCredits] = useState(10);

  const appDispatch = useAppDispatch();

  const modalToggleRef = useRef<HTMLInputElement>(null);

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

      modalToggleRef.current?.click();

      appDispatch({
        type: 'add:alert',
        alert: {
          severity: 'success',
          message: 'You have successfully purchased credits!',
        },
      });

      setIsLoading(false);
    } catch {
      appDispatch({
        type: 'add:alert',
        alert: {
          severity: 'error',
          message: 'Something went wrong. Please try again.',
        },
      });
      setIsLoading(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredits(parseInt(e.target.value));
  };

  return { continueToCheckout, credits, isLoading, onChange, modalToggleRef };
}
