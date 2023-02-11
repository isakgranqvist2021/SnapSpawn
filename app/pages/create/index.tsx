import { GenerateAvatarsForm } from '@aa/components/generate-avatars';
import {
  AuthPageContainer,
  DefaultProps,
} from '@aa/containers/auth-page-container';
import { loadServerSideProps } from '@aa/utils';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default function Create(props: DefaultProps) {
  return (
    <AuthPageContainer title="Generate Avatar" {...props}>
      <GenerateAvatarsForm />
    </AuthPageContainer>
  );
}

export const getServerSideProps = withPageAuthRequired({
  returnTo: '/create',
  getServerSideProps: loadServerSideProps,
});
