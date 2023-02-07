import { useApiDispatch, useApiState } from '@aa/context/api-context';
import getStripe from '@aa/services/stripe';
import { AlertSeverity } from '@aa/types';
import { useState } from 'react';

export function useAddCreditsModal() {
  const [credits, setCredits] = useState(10);

  const apiState = useApiState();
  const apiDispatch = useApiDispatch();

  const setIsLoading = (isLoading: boolean) => {
    apiDispatch({ isLoading, type: 'credits:set-is-loading' });
  };

  const addAlert = (severity: AlertSeverity, message: string) => {
    apiDispatch({ alert: { message, severity }, type: 'alerts:add' });
  };

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

      addAlert('success', 'You have successfully purchased credits!');
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      addAlert('error', 'Something went wrong. Please try again.');
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredits(parseInt(e.target.value));
  };

  return {
    isLoading: apiState.credits.isLoading,
    continueToCheckout,
    credits,
    onChange,
  };
}
