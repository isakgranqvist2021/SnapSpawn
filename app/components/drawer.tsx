import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type DrawerProps = PropsWithChildren<{
  position: 'left' | 'right';
  isOpen: boolean;
  onClose: () => void;
}>;

function getDrawerClassNames(isOpen: boolean, position: 'left' | 'right') {
  const backdrop = isOpen
    ? 'fixed inset-0 z-10 ease-in-out transition-all duration-200'
    : 'fixed inset-0 z-10 ease-in-out transition-all duration-200 pointer-events-none';

  let drawer = isOpen
    ? 'fixed top-0 bg-base-100 h-screen flex flex-col justify-between overflow-hidden ease-in-out transition-all duration-200 z-20 sm:w-96 w-full sm:opacity-1 opacity-1 pointer-events-auto'
    : 'fixed top-0 bg-base-100 h-screen flex flex-col justify-between overflow-hidden ease-in-out transition-all duration-200 z-20 sm:w-0 w-full sm:opacity-1 opacity-0 pointer-events-none';

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
    <div className="flex flex-col gap-5 overflow-auto p-5 sm:w-96 w-full">
      {children}
    </div>
  );
}

export function DrawerFooter(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div className="flex gap-3 p-5 justify-between bg-base-200">{children}</div>
  );
}

export function Drawer(props: DrawerProps) {
  const { children, position, isOpen, onClose } = props;

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
        onClick={onClose}
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
