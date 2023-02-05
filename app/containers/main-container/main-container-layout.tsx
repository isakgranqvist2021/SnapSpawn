import { PropsWithChildren } from 'react';

export function MainContainerLayout(props: PropsWithChildren) {
  const { children } = props;

  return <div className="flex h-full overflow-hidden bg-white">{children}</div>;
}
