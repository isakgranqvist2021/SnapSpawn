import { AddCreditsForm } from '@aa/components/add-credits-form';
import {
  AuthPageContainer,
  DefaultProps,
} from '@aa/containers/auth-page-container';
import { loadServerSideProps } from '@aa/utils';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Link from 'next/link';

export default function Refill(props: DefaultProps) {
  return (
    <AuthPageContainer title="Add Credits" {...props}>
      <div className="w-full p-5">
        <div className="text-sm breadcrumbs">
          <ul>
            <li>
              <Link href="/account">My Avatars</Link>
            </li>
            <li>
              <Link href="/refill">Add Credits</Link>
            </li>
          </ul>
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
