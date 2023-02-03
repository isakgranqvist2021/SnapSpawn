import getStripe from '@aa/services/stripe';
import { useState } from 'react';

export function useAddCreditsModal() {
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

  return { continueToCheckout, credits, isLoading, onChange };
}
