import { Alert, useAppDispatch, useAppState } from '@aa/context';
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

  const appDispatch = useAppDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      appDispatch({ type: 'remove:alert', id });
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [appDispatch, id]);

  return (
    <div className="toast">
      <PageSnackbarAlert {...props} />
    </div>
  );
}

function renderPageSnackbarToast(alert: Alert, index: number) {
  return <PageSnackbarToast key={`page-snackbar-toast-${index}`} {...alert} />;
}

export function PageSnackbar() {
  const appState = useAppState();

  return (
    <React.Fragment>
      {appState.alerts.map(renderPageSnackbarToast)}
    </React.Fragment>
  );
}
