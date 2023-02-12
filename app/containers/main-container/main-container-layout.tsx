import { PropsWithChildren } from 'react';

export function MainContainerLayout(props: PropsWithChildren) {
  const { children } = props;

  return <div className="flex-grow-1 flex bg-white flex-auto">{children}</div>;
}
