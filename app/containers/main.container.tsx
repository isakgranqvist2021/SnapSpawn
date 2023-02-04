import { PropsWithChildren } from 'react';

export function MainContainer(props: PropsWithChildren) {
  const { children } = props;

  return (
    <main className="bg-slate-800 h-screen overflow-hidden">
      <div className="bg-white h-screen overflow-auto flex flex-col items-center pb-20 md:p-5 md:pb-0">
        {children}
      </div>
    </main>
  );
}
