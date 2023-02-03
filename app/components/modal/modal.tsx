import React, { PropsWithChildren } from 'react';

interface ModalProps extends PropsWithChildren {
  id: string;
  title: string;
}

export function Modal(props: ModalProps) {
  const { children, id, title } = props;

  return (
    <React.Fragment>
      <input type="checkbox" id={id} className="modal-toggle" />
      <label htmlFor={id} className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">{title}</h3>
          {children}
        </label>
      </label>
    </React.Fragment>
  );
}
