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

      const data: { referral: ReferralModel; message?: string } | undefined =
        await res.json();
      if (!data?.referral) {
        throw new Error(data?.message ?? 'Unknown error');
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
          message:
            err instanceof Error
              ? err.message
              : 'Something went wrong. Please try again later.',
        },
      });
      appContext.dispatch({
        type: 'referrals:set-is-loading',
        isLoading: false,
      });
    }
  };
}
