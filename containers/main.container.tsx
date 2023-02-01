import { PropsWithChildren } from 'react';

export function MainContainer(props: PropsWithChildren) {
  const { children } = props;

  return (
    <main className="bg-slate-800 h-screen overflow-hidden">
      <div className="container mx-auto bg-white h-screen overflow-auto flex flex-col items-center p-5">
        {children}
      </div>
    </main>
  );
}
