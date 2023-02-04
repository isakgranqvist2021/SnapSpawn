import {
  Dispatch,
  PropsWithChildren,
  Reducer,
  createContext,
  useContext,
  useReducer,
} from 'react';
import { uid } from 'uid';

type AlertSeverity = 'error' | 'info' | 'success' | 'warning';

export interface Alert {
  id: string;
  message: string;
  severity: AlertSeverity;
}

interface AppContextState {
  avatars: string[];
  credits: number;
  alerts: Alert[];
}

type ReducerAction =
  | { type: 'add:avatars'; avatars: string[] }
  | { type: 'reduce:credits'; reduceCreditsBy: number }
  | { type: 'add:alert'; alert: Omit<Alert, 'id'> }
  | { type: 'remove:alert'; id: string };

interface AppContextType {
  state: AppContextState;
  dispatch: Dispatch<ReducerAction>;
}

const AppContext = createContext<AppContextType>({
  dispatch: (value) => {},
  state: { avatars: [], credits: 0, alerts: [] },
});

function reducer(
  state: AppContextState,
  action: ReducerAction,
): AppContextState {
  switch (action.type) {
    case 'add:avatars':
      return {
        ...state,
        avatars: [...action.avatars, ...state.avatars],
      };

    case 'reduce:credits':
      return {
        ...state,
        credits: state.credits - action.reduceCreditsBy,
      };

    case 'add:alert':
      return {
        ...state,
        alerts: [...state.alerts, { ...action.alert, id: uid() }],
      };

    case 'remove:alert':
      const alerts = [...state.alerts];
      const index = alerts.findIndex((alert) => alert.id === action.id);
      alerts.splice(index, 1);
      return { ...state, alerts };
  }
}

export function AppProvider(
  props: PropsWithChildren<Partial<AppContextState>>,
) {
  const { children, ...rest } = props;

  const [state, dispatch] = useReducer<Reducer<AppContextState, ReducerAction>>(
    reducer,
    {
      avatars: [],
      credits: 0,
      alerts: [],
      ...rest,
    },
  );

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppState = () => useContext(AppContext).state;
export const useAppDispatch = () => useContext(AppContext).dispatch;
