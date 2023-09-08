import { DefaultHead } from '@aa/components/default-head';
import { Footer } from '@aa/components/footer';
import { Nav } from '@aa/components/nav';
import { AppContext, AppProvider } from '@aa/context';
import { Alert } from '@aa/types';
import { loadServerSideProps } from '@aa/utils';
import { Fragment, useContext, useEffect } from 'react';

import {
  MainContainer,
  MainContainerContent,
  MainContainerLayout,
} from './main-container';

export type DefaultProps = Awaited<
  ReturnType<typeof loadServerSideProps>
>['props'];

interface AuthPageContainerProps extends DefaultProps {
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

  const appContext = useContext(AppContext);

  useEffect(() => {
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
  const appContext = useContext(AppContext);

  return (
    <Fragment>{appContext.state.alerts.map(renderPageSnackbarToast)}</Fragment>
  );
}

export function AuthPageContainer(props: AuthPageContainerProps) {
  const { avatars, credits, children, title } = props;

  return (
    <AppProvider avatars={avatars} credits={credits}>
      <DefaultHead title={title} />
      <PageSnackbar />

      <MainContainer>
        <Nav />

        <MainContainerLayout>
          <MainContainerContent>{children}</MainContainerContent>
        </MainContainerLayout>

        <Footer />
      </MainContainer>
    </AppProvider>
  );
}
