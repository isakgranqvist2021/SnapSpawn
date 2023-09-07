import { AddCreditsForm } from '@aa/components/add-credits-form';
import {
  AuthPageContainer,
  DefaultProps,
} from '@aa/containers/auth-page-container';
import { loadServerSideProps } from '@aa/utils';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default function Refill(props: DefaultProps) {
  return (
    <AuthPageContainer title="Add Credits" {...props}>
      <div className="px-5 py-10">
        <div>
          <div className="flex gap-5">
            <h1 className="text-3xl leading-10">Add Credits</h1>
          </div>
          <p className="max-w-prose">
            You can add credits to your account to generate more pictures.
            Credits will be added to your account after the payment has been
            completed.
          </p>
        </div>

        <AddCreditsForm />
      </div>
    </AuthPageContainer>
  );
}

export const getServerSideProps = withPageAuthRequired({
  returnTo: '/refill',
  getServerSideProps: loadServerSideProps,
});
