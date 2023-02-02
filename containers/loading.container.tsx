import { Spinner } from '@aa/components/spinner';

import { MainContainer } from './main.container';

export function LoadingContainer() {
  return (
    <MainContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <Spinner />
      </div>
    </MainContainer>
  );
}
