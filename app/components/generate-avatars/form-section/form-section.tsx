import { PropsWithChildren } from 'react';

export function FormSection(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div className="flex flex-wrap gap-3 p-5 justify-center">{children}</div>
  );
}
