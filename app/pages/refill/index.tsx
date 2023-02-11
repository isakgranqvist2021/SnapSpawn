import { AddCreditsForm } from '@aa/components/add-credits';
import {
  AuthPageContainer,
  DefaultProps,
} from '@aa/containers/auth-page-container';
import { loadServerSideProps } from '@aa/utils';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default function Refill(props: DefaultProps) {
  return (
    <AuthPageContainer title="Add Credits" {...props}>
      <AddCreditsForm />
    </AuthPageContainer>
  );
}

export const getServerSideProps = withPageAuthRequired({
  returnTo: '/refill',
  getServerSideProps: loadServerSideProps,
});
