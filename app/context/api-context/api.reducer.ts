import { uid } from 'uid';

import { ApiContextState, ReducerAction } from './api.types';

function creditsReducer(
  state: ApiContextState,
  action: ReducerAction,
): ApiContextState {
  switch (action.type) {
    case 'credits:reduce':
      return {
        ...state,
        credits: {
          ...state.credits,
          data: state.credits.data - action.reduceCreditsBy,
        },
      };

    case 'credits:set-is-loading':
      return {
        ...state,
        credits: { ...state.credits, isLoading: action.isLoading },
      };

    default:
      return state;
  }
}

function avatarsReducer(
  state: ApiContextState,
  action: ReducerAction,
): ApiContextState {
  switch (action.type) {
    case 'avatars:add':
      return {
        ...state,
        avatars: {
          ...state.avatars,
          data: [...action.avatars, ...state.avatars.data],
        },
      };

    case 'avatars:set-is-loading':
      return {
        ...state,
        avatars: {
          ...state.avatars,
          isLoading: action.isLoading,
        },
      };

    default:
      return state;
  }
}

function alertsReducer(
  state: ApiContextState,
  action: ReducerAction,
): ApiContextState {
  switch (action.type) {
    case 'alerts:add':
      return {
        ...state,
        alerts: [...state.alerts, { ...action.alert, id: uid() }],
      };

    case 'alerts:remove':
      const alerts = [...state.alerts];
      const index = alerts.findIndex((alert) => alert.id === action.id);
      alerts.splice(index, 1);
      return { ...state, alerts };

    default:
      return state;
  }
}

export function apiReducer(
  state: ApiContextState,
  action: ReducerAction,
): ApiContextState {
  if (action.type.startsWith('credits:')) {
    return creditsReducer(state, action);
  }

  if (action.type.startsWith('avatars:')) {
    return avatarsReducer(state, action);
  }

  if (action.type.startsWith('alert:')) {
    return alertsReducer(state, action);
  }

  return state;
}
