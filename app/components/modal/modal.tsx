import React from 'react';

interface ModalProps extends React.ComponentPropsWithoutRef<'label'> {
  id: string;
  title: string;
  footer: JSX.Element;
}

export function _Modal(
  props: ModalProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const { children, footer, id, title, ...rest } = props;

  return (
    <React.Fragment>
      <input type="checkbox" id={id} className="modal-toggle" ref={ref} />
      <label htmlFor={id} className="modal cursor-pointer" {...rest}>
        <label
          className="modal-box relative max-h-max flex flex-col overflow-hidden p-0 "
          htmlFor=""
        >
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="text-lg font-bold">{title}</h3>
            <label htmlFor={id} className="btn btn-sm btn-circle ">
              ✕
            </label>
          </div>
          <div className="overflow-auto p-3">{children}</div>

          <div className="p-3 border-t w-full">{footer}</div>
        </label>
      </label>
    </React.Fragment>
  );
}

export const Modal = React.forwardRef<HTMLInputElement, ModalProps>(_Modal);
