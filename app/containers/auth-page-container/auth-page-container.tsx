import { DefaultHead } from '@aa/components/default-head';
import { Footer } from '@aa/components/footer';
import { Nav } from '@aa/components/nav';
import { PageSnackbar } from '@aa/components/page-snackbar';
import { ApiProvider } from '@aa/context/api-context';
import { loadServerSideProps } from '@aa/utils';

import {
  MainContainer,
  MainContainerContent,
  MainContainerLayout,
} from '../main-container';

export type DefaultProps = Awaited<
  ReturnType<typeof loadServerSideProps>
>['props'];

interface AuthPageContainerProps extends DefaultProps {
  children: React.ReactNode;
  title: string;
}

export function AuthPageContainer(props: AuthPageContainerProps) {
  const { avatars, credits, children, title } = props;

  return (
    <ApiProvider avatars={avatars} credits={credits}>
      <DefaultHead title={title} />

      <MainContainer>
        <Nav />

        <MainContainerLayout>
          <MainContainerContent>{children}</MainContainerContent>
        </MainContainerLayout>

        <Footer />

        <PageSnackbar />
      </MainContainer>
    </ApiProvider>
  );
}
