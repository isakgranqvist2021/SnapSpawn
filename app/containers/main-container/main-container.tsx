import { PropsWithChildren } from 'react';

export function MainContainer(props: PropsWithChildren) {
  const { children } = props;

  return (
    <main className="min-h-screen	justify-between flex flex-col bg-base-100">
      {children}
    </main>
  );
}
