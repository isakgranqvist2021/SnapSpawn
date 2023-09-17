import { AppContext } from '@aa/context';
import getStripe from '@aa/services/stripe';
import { useContext } from 'react';

export function useAddCredits() {
  const appContext = useContext(AppContext);

  return async (credits: number) => {
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
}
