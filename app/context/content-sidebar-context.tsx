import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState,
} from 'react';

interface ContentSidebarContextType {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const ContentSidebarContext = createContext<ContentSidebarContextType>({
  isOpen: false,
  setIsOpen: () => {},
});

export function ContentSidebarProvider(props: PropsWithChildren) {
  const { children } = props;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <ContentSidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ContentSidebarContext.Provider>
  );
}
