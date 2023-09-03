import { PropsWithChildren } from 'react';

export function MainContainerContent(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div className="flex flex-col items-center flex-grow bg-base-100">
      {children}
    </div>
  );
}

export function MainContainerLayout(props: PropsWithChildren) {
  const { children } = props;

  return <div className="flex bg-white flex-auto">{children}</div>;
}

export function MainContainer(props: PropsWithChildren) {
  const { children } = props;

  return (
    <main className="min-h-screen	justify-between flex flex-col bg-base-100">
      {children}
    </main>
  );
}
