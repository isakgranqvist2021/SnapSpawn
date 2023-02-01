import { Spinner } from '@aa/components/spinner';

import { MainContainer } from './main.container';

export function LoadingContainer() {
  return (
    <MainContainer>
      <div className="mt-5">
        <Spinner />
      </div>
    </MainContainer>
  );
}
