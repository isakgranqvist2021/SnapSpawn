import { useApiDispatch, useApiState } from '@aa/context/api-context';
import { Alert } from '@aa/types';
import React, { useEffect } from 'react';

function PageSnackbarAlert(props: Alert) {
  const { message, severity } = props;

  const messageBox = (
    <div>
      <span>{message}</span>
    </div>
  );

  switch (severity) {
    case 'error':
      return <div className="alert alert-error shadow-lg">{messageBox}</div>;

    case 'info':
      return <div className="alert alert-info shadow-lg">{messageBox}</div>;

    case 'success':
      return <div className="alert alert-success shadow-lg">{messageBox}</div>;

    case 'warning':
      return <div className="alert alert-warning shadow-lg">{messageBox}</div>;
  }
}

function PageSnackbarToast(props: Alert) {
  const { id } = props;

  const apiDispatch = useApiDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      apiDispatch({ type: 'alerts:remove', id });
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [apiDispatch, id]);

  return (
    <div className="toast z-20">
      <PageSnackbarAlert {...props} />
    </div>
  );
}

function renderPageSnackbarToast(alert: Alert, index: number) {
  return <PageSnackbarToast key={`page-snackbar-toast-${index}`} {...alert} />;
}

export function PageSnackbar() {
  const apiState = useApiState();

  return (
    <React.Fragment>
      {apiState.alerts.map(renderPageSnackbarToast)}
    </React.Fragment>
  );
}
