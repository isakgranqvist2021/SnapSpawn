import React from 'react';

interface ModalProps extends React.ComponentPropsWithoutRef<'label'> {
  id: string;
  title: string;
}

export function _Modal(
  props: ModalProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const { children, id, title, ...rest } = props;

  return (
    <React.Fragment>
      <input type="checkbox" id={id} className="modal-toggle" ref={ref} />
      <label htmlFor={id} className="modal cursor-pointer" {...rest}>
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">{title}</h3>
          {children}
        </label>
      </label>
    </React.Fragment>
  );
}

export const Modal = React.forwardRef<HTMLInputElement, ModalProps>(_Modal);
