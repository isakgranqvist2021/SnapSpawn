import { Alert, useAppDispatch, useAppState } from '@aa/context';
import React, { useEffect } from 'react';

function PageSnackbarAlert(props: Alert) {
  const { message, id, severity } = props;

  const appDispatch = useAppDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      appDispatch({ type: 'remove:alert', id });
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [appDispatch]);

  return (
    <div className="toast">
      <div className={`alert alert-${severity}`}>
        <div>
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
}

function renderPageSnackbarAlert(alert: Alert, index: number) {
  return <PageSnackbarAlert key={`page-snackbar-alert-${index}`} {...alert} />;
}

export function PageSnackbar() {
  const appState = useAppState();

  return (
    <React.Fragment>
      {appState.alerts.map(renderPageSnackbarAlert)}
    </React.Fragment>
  );
}
