import { PropsWithChildren } from 'react';

export function MainContainerLayout(props: PropsWithChildren) {
  const { children } = props;

  return <div className="flex bg-white">{children}</div>;
}
