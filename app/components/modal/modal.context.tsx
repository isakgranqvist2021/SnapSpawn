import { PropsWithChildren, createContext } from 'react';

export const ModalContext = createContext({
  id: '',
});

interface ModalProviderProps extends PropsWithChildren {
  id: string;
}

export function ModalProvider(props: ModalProviderProps) {
  const { children, id } = props;

  return (
    <ModalContext.Provider value={{ id }}>{children}</ModalContext.Provider>
  );
}
