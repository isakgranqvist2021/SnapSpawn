import { PropsWithChildren } from 'react';

interface ModalProps extends PropsWithChildren {
  isOpen: boolean;
  onClose: () => void;
}

export function Modal(props: ModalProps) {
  const { children, isOpen, onClose } = props;

  const preventPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className={[
        'fixed inset-0 bg-slate-600 flex items-center justify-center ease-linear duration-100 z-20',
        isOpen
          ? 'bg-opacity-75 pointer-events-auto'
          : 'bg-opacity-0 pointer-events-none',
      ].join(' ')}
      onClick={onClose}
    >
      <div
        className={[
          'bg-white max-w-md w-fit rounded ease-linear duration-100',
          isOpen ? 'scale-1' : 'scale-0',
        ].join(' ')}
        onClick={preventPropagation}
      >
        {children}
      </div>
    </div>
  );
}
