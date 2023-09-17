import { AppContext } from '@aa/context';
import { ReferralModel } from '@aa/models/referral';
import { useContext } from 'react';

export function useSendReferral() {
  const appContext = useContext(AppContext);

  return async (toEmail: string) => {
    try {
      appContext.dispatch({
        type: 'referrals:set-is-loading',
        isLoading: true,
      });

      const res = await fetch('/api/refer-a-friend', {
        body: JSON.stringify({ toEmail }),
        method: 'POST',
      });

      if (res.status !== 200) {
        throw new Error('Invalid response');
      }

      const data: { referral: ReferralModel } | undefined = await res.json();
      if (!data?.referral) {
        throw new Error('Invalid response');
      }

      appContext.dispatch({
        type: 'referrals:add',
        referrals: [data.referral],
      });
      appContext.dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'success',
          message: 'Referral sent!',
        },
      });
      appContext.dispatch({
        type: 'referrals:set-is-loading',
        isLoading: false,
      });
    } catch (err) {
      appContext.dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'error',
          message: 'Something went wrong. Please try again later.',
        },
      });
      appContext.dispatch({
        type: 'referrals:set-is-loading',
        isLoading: false,
      });
    }
  };
}
