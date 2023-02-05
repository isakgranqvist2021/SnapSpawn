import React from 'react';

interface MainContainerSidebarProps
  extends React.ComponentPropsWithoutRef<'div'> {
  isOpen: boolean;
  onClose: () => void;
  closeIcon: JSX.Element;
}

interface SidebarBackdropProps {
  isOpen: boolean;
  onClose: () => void;
}

function SidebarBackdrop(props: SidebarBackdropProps) {
  const { isOpen, onClose } = props;

  return (
    <div
      onClick={onClose}
      className={[
        'fixed',
        'inset-0',
        'z-10',
        'bg-black',
        'duration-200',
        'ease-in',
        isOpen ? 'pointer-events-auto' : 'pointer-events-none',
        isOpen ? 'opacity-25' : 'opacity-0',
      ].join(' ')}
    ></div>
  );
}

export function MainContainerSidebar(props: MainContainerSidebarProps) {
  const { children, closeIcon, isOpen, onClose, className } = props;

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <React.Fragment>
      <SidebarBackdrop isOpen={isOpen} onClose={onClose} />

      <div
        onClick={stopPropagation}
        className={[
          'sidebar',
          className,
          'fixed',
          'h-full',
          'top-0',
          'z-20',
          'flex',
          'flex-col',
          'overflow-hidden',
          'ease-in',
          'duration-200',
          'bg-base-100',
          isOpen ? 'w-80' : 'w-0',
        ].join(' ')}
      >
        <div className="w-80 ease-in overflow-auto duration-200 h-full pt-3">
          {closeIcon}

          {children}
        </div>
      </div>
    </React.Fragment>
  );
}
