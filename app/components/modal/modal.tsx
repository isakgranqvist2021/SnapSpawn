import React, { PropsWithChildren } from 'react';

import { ModalContext, ModalProvider } from './modal.context';

interface ModalHeaderProps {
  title: string;
}

interface ModalProps extends React.ComponentPropsWithoutRef<'label'> {
  id: string;
}

export function ModalContainer(props: PropsWithChildren) {
  const { children } = props;
  const { id } = React.useContext(ModalContext);

  return (
    <label
      className="modal-box relative max-h-max flex flex-col overflow-hidden p-0"
      htmlFor={id}
    >
      {children}
    </label>
  );
}
export function ModalBody(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div className="overflow-auto flex flex-col p-5 gap-5">{children}</div>
  );
}

export function ModalHeader(props: ModalHeaderProps) {
  const { title } = props;
  const { id } = React.useContext(ModalContext);

  return (
    <div className="flex justify-between items-center px-3 pt-3">
      <h3 className="text-lg font-bold">{title}</h3>
      <label htmlFor={id} className="btn btn-sm btn-circle">
        ✕
      </label>
    </div>
  );
}

export function ModalFooter(props: PropsWithChildren) {
  const { children } = props;

  return <div className="pb-3 px-3 w-full">{children}</div>;
}

export function _Modal(
  props: ModalProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const { children, id, ...rest } = props;

  return (
    <ModalProvider id={id}>
      <input type="checkbox" id={id} className="modal-toggle" ref={ref} />
      <label htmlFor={id} className="modal cursor-pointer" {...rest}>
        {children}
      </label>
    </ModalProvider>
  );
}

export const Modal = React.forwardRef<HTMLInputElement, ModalProps>(_Modal);
