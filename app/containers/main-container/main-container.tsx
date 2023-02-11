import { PropsWithChildren } from 'react';

export function MainContainer(props: PropsWithChildren) {
  const { children } = props;

  return (
    <main className="h-screen flex flex-col overflow-hidden bg-base-100">
      {children}
    </main>
  );
}
