import { AppContext } from '@aa/context';
import { DiscountModel } from '@aa/models/discount';
import getStripe from '@aa/services/stripe';
import React from 'react';

export function useAddCredits() {
  const appContext = React.useContext(AppContext);

  return async (credits: number, discountId?: string) => {
    try {
      appContext.dispatch({ type: 'credits:set-is-loading', isLoading: true });

      const stripe = await getStripe();

      if (!stripe) {
        throw new Error('Stripe is not loaded');
      }

      const res = await fetch('/api/checkout_sessions', {
        body: JSON.stringify({ credits, discountId }),
        method: 'POST',
      }).then((res) => res.json());

      await stripe.redirectToCheckout({
        sessionId: res.id,
      });
    } catch (err) {
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
