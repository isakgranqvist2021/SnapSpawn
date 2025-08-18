import { AppContext } from '@aa/context';
import { DiscountModel } from '@aa/models/discount';
import React from 'react';

export function useVerifyDiscountCode() {
  const appContext = React.useContext(AppContext);

  return async (discountCode: string): Promise<DiscountModel | null> => {
    try {
      const res = await fetch('/api/verify-discount-code', {
        body: JSON.stringify({ discountCode }),
        method: 'POST',
      });

      if (!res.ok) {
        appContext.dispatch({
          type: 'alerts:add',
          alert: {
            severity: 'error',
            message: 'Discount code is invalid',
          },
        });
        return null;
      }

      const data = await res.json();

      return data.discount as DiscountModel;
    } catch (err) {
      appContext.dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'error',
          message: 'Something went wrong. Please try again later.',
        },
      });

      return null;
    }
  };
}
