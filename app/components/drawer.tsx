import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type DrawerProps = PropsWithChildren<{
  position: 'left' | 'right';
}>;

export const DrawerContext = createContext({
  isOpen: false,
  closeDrawer: () => {},
  openDrawer: () => {},
});

export function DrawerProvider(props: PropsWithChildren) {
  const { children } = props;

  const [isOpen, setIsOpen] = useState(false);

  const closeDrawer = () => setIsOpen(false);

  const openDrawer = () => setIsOpen(true);

  return (
    <DrawerContext.Provider value={{ isOpen, closeDrawer, openDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
}

function getDrawerClassNames(isOpen: boolean, position: 'left' | 'right') {
  const backdrop = isOpen
    ? 'fixed inset-0 z-10 ease-in-out transition-all duration-200'
    : 'fixed inset-0 z-10 ease-in-out transition-all duration-200 pointer-events-none';

  let drawer = isOpen
    ? 'fixed top-0 bg-base-100 h-screen flex flex-col justify-between overflow-hidden ease-in-out transition-all duration-200 z-20 w-96'
    : 'fixed top-0 bg-base-100 h-screen flex flex-col justify-between overflow-hidden ease-in-out transition-all duration-200 z-20 w-0';

  switch (position) {
    case 'left':
      drawer += ' left-0';
      break;
    case 'right':
      drawer += ' right-0';
  }

  return { backdrop, drawer };
}

export function DrawerContent(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div className="flex flex-col gap-5 overflow-auto p-5 w-96">{children}</div>
  );
}

export function DrawerFooter(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div className="flex gap-3 p-5 justify-between bg-base-200">{children}</div>
  );
}

export function Drawer(props: DrawerProps) {
  const { children, position } = props;

  const { isOpen, closeDrawer } = useContext(DrawerContext);

  const { backdrop, drawer } = getDrawerClassNames(isOpen, position);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <div>
      <div
        onClick={closeDrawer}
        className={backdrop}
        style={
          isOpen
            ? {
                backgroundColor: 'rgba(0,0,0,0.7)',
              }
            : undefined
        }
      ></div>

      <div className={drawer}>{children}</div>
    </div>
  );
}
