import { PropsWithChildren } from 'react';

export function MainContainerContent(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div className="h-full overflow-auto flex flex-col items-center flex-grow bg-base-100">
      {children}
    </div>
  );
}
