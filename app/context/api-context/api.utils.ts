import { AvatarModel, Size } from '@aa/models';
import getStripe from '@aa/services/stripe';
import { Dispatch } from 'react';

import { ReducerAction } from './api.types';

export function getGenerateAvatars<T>(
  path: string,
  dispatch: Dispatch<ReducerAction>,
) {
  return async (payload: T, size: Size, n: number) => {
    try {
      dispatch({ type: 'avatars:set-is-loading', isLoading: true });

      const res = await fetch(path, {
        body: JSON.stringify({ options: payload, size, n }),
        method: 'POST',
      });

      if (res.status !== 200) {
        throw new Error('Invalid response');
      }

      const data: { avatars: AvatarModel[] } | undefined = await res.json();

      if (!data || !Array.isArray(data.avatars)) {
        throw new Error('Invalid response');
      }

      dispatch({ type: 'avatars:add', avatars: data.avatars });
      dispatch({
        type: 'credits:reduce',
        reduceCreditsBy: data.avatars.length,
      });
      dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'success',
          message: 'Avatars generated successfully!',
        },
      });
      dispatch({ type: 'avatars:set-is-loading', isLoading: false });

      return data.avatars;
    } catch {
      dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'error',
          message: 'Something went wrong. Please try again later.',
        },
      });
      dispatch({ type: 'avatars:set-is-loading', isLoading: false });

      return null;
    }
  };
}

export function getAddCredits(path: string, dispatch: Dispatch<ReducerAction>) {
  return async (payload: number) => {
    try {
      dispatch({ type: 'credits:set-is-loading', isLoading: true });

      const stripe = await getStripe();

      if (!stripe) {
        throw new Error('Stripe is not loaded');
      }

      const res = await fetch(path, {
        body: JSON.stringify({ credits: payload }),
        method: 'POST',
      }).then((res) => res.json());

      await stripe.redirectToCheckout({
        sessionId: res.id,
      });
    } catch {
      dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'error',
          message: 'Something went wrong. Please try again later.',
        },
      });
      dispatch({ type: 'credits:set-is-loading', isLoading: false });
    }
  };
}
