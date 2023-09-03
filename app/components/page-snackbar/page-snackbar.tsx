import { AppContext } from '@aa/context';
import { Alert } from '@aa/types';
import React, { useContext, useEffect } from 'react';

function PageSnackbarAlert(props: Alert) {
  const { message, severity } = props;

  const messageBox = (
    <div>
      <span>{message}</span>
    </div>
  );

  switch (severity) {
    case 'error':
      return (
        <div className="alert alert-error shadow-lg z-30">{messageBox}</div>
      );

    case 'info':
      return (
        <div className="alert alert-info shadow-lg z-30">{messageBox}</div>
      );

    case 'success':
      return (
        <div className="alert alert-success shadow-lg z-30">{messageBox}</div>
      );

    case 'warning':
      return (
        <div className="alert alert-warning shadow-lg z-30">{messageBox}</div>
      );
  }
}

function PageSnackbarToast(props: Alert) {
  const { id } = props;

  const { methods } = useContext(AppContext);

  useEffect(() => {
    const timeout = setTimeout(() => {
      methods.clearAlert(id);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [methods, id]);

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
  const { state } = useContext(AppContext);

  return (
    <React.Fragment>{state.alerts.map(renderPageSnackbarToast)}</React.Fragment>
  );
}
