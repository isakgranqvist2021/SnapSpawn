import { AppContext } from '@aa/context';
import React from 'react';

export function useDeleteReferral() {
  const appContext = React.useContext(AppContext);

  return async (id: string) => {
    try {
      appContext.dispatch({
        type: 'delete-referral:set-is-loading',
        isLoading: true,
      });

      const res = await fetch(`/api/delete-referral/${id}`, {
        method: 'DELETE',
      });
      if (res.status !== 204) {
        throw new Error('Invalid response');
      }

      appContext.dispatch({ type: 'referrals:remove', id });
      appContext.dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'success',
          message: 'Referral deleted successfully!',
        },
      });
      appContext.dispatch({
        type: 'delete-referral:set-is-loading',
        isLoading: false,
      });
      return;
    } catch {
      appContext.dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'error',
          message: 'Something went wrong. Please try again later.',
        },
      });
      appContext.dispatch({
        type: 'delete-referral:set-is-loading',
        isLoading: false,
      });

      return null;
    }
  };
}
