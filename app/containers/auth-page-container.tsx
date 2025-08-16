import { DefaultHead } from '@aa/components/default-head';
import { Footer } from '@aa/components/footer';
import { Nav } from '@aa/components/nav';
import { AppContext } from '@aa/context';
import { Alert } from '@aa/types';
import { loadServerSideProps } from '@aa/utils';
import React from 'react';

import {
  MainContainer,
  MainContainerContent,
  MainContainerLayout,
} from './main-container';

export type DefaultProps = Awaited<
  ReturnType<typeof loadServerSideProps>
>['props'];

interface AuthPageContainerProps {
  children: React.ReactNode;
  title: string;
}

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

  const appContext = React.useContext(AppContext);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      appContext.dispatch({ type: 'alerts:remove', id });
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [appContext, id]);

  return (
    <div className="toast z-20">
      <PageSnackbarAlert {...props} />
    </div>
  );
}

function renderPageSnackbarToast(alert: Alert, index: number) {
  return <PageSnackbarToast key={`page-snackbar-toast-${index}`} {...alert} />;
}

function PageSnackbar() {
  const appContext = React.useContext(AppContext);

  return (
    <React.Fragment>
      {appContext.state.alerts.map(renderPageSnackbarToast)}
    </React.Fragment>
  );
}

export function AuthPageContainer(props: AuthPageContainerProps) {
  const { children, title } = props;

  return (
    <React.Fragment>
      <DefaultHead title={title} />
      <PageSnackbar />

      <MainContainer>
        <Nav />

        <MainContainerLayout>
          <MainContainerContent>{children}</MainContainerContent>
        </MainContainerLayout>

        <Footer />
      </MainContainer>
    </React.Fragment>
  );
}
