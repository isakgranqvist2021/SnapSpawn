import { createContext } from 'react';

interface ContextProp<T> {
  value: T;
  setValue: (value: T) => any;
}

export interface AppContextType {
  credits: ContextProp<number>;
  avatars: ContextProp<string[]>;
}

export const AppContext = createContext<AppContextType>({
  avatars: { value: [], setValue: (value) => {} },
  credits: { value: 0, setValue: (credits) => {} },
});

export const AppProvider = AppContext.Provider;
export const AppConsumer = AppContext.Consumer;
