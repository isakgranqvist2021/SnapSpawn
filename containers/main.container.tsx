import { PropsWithChildren } from 'react';

export function MainContainer(props: PropsWithChildren) {
  const { children } = props;

  return (
    <main className="bg-slate-800 h-screen overflow-hidden">
      <div className="bg-white h-screen overflow-auto flex flex-col items-center md:p-5">
        {children}
      </div>
    </main>
  );
}
