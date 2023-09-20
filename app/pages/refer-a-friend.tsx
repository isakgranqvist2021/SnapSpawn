import { EmptyState } from '@aa/components/empty-state';
import { Spinner } from '@aa/components/spinner';
import {
  AuthPageContainer,
  DefaultProps,
} from '@aa/containers/auth-page-container';
import { AppContext } from '@aa/context';
import { useSendReferral } from '@aa/hooks/use-send-referral';
import { ReferralModel } from '@aa/models/referral';
import { loadServerSideProps } from '@aa/utils';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import dayjs from 'dayjs';
import { Fragment, useContext, useState } from 'react';

function InviteForm() {
  const appContext = useContext(AppContext);

  const [email, setEmail] = useState('');

  const sendReferral = useSendReferral();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    sendReferral(email);

    setEmail('');
  };

  const alreadyInvited = appContext.state.referrals.data.some(
    (referral) => referral.email === email,
  );

  return (
    <Fragment>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
        <div className="form-control w-full max-w-xs">
          <input
            disabled={appContext.state.referrals.isLoading}
            className="input input-bordered w-full max-w-xs"
            onChange={handleEmailChange}
            placeholder="Email"
            required
            type="email"
            value={email}
          />
        </div>

        <button
          className="btn btn-primary"
          disabled={appContext.state.referrals.isLoading || alreadyInvited}
          type="submit"
        >
          {appContext.state.referrals.isLoading && (
            <div className="absolute z-10">
              <Spinner />
            </div>
          )}

          <span
            className={appContext.state.referrals.isLoading ? 'opacity-0' : ''}
          >
            Send invitation
          </span>
        </button>
      </form>

      {alreadyInvited && (
        <p className="text-error">
          You have already invited this email address.
        </p>
      )}
    </Fragment>
  );
}

function renderReferralTableRow(referral: ReferralModel, index: number) {
  const getReferralBadge = () => {
    switch (referral.status) {
      case 'success':
        return <span className="badge badge-success">Active</span>;
      case 'pending':
        return <span className="badge badge-warning">Pending</span>;
      case 'failure':
        return <span className="badge badge-error">Failed</span>;
    }
  };

  return (
    <tr key={referral.id}>
      <th>{index + 1}</th>
      <td>{referral.email}</td>
      <td>{dayjs(referral.createdAt).format('YYYY-MM-DD HH:mm')}</td>
      <td>{referral.creditsEarned}</td>
      <td>{getReferralBadge()}</td>
    </tr>
  );
}

function ReferralsTable() {
  const appContext = useContext(AppContext);

  if (!appContext.state.referrals.data.length) {
    return <EmptyState message="No referrals" />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-xs">
        <thead>
          <tr>
            <th>#</th>
            <th>Email</th>
            <th>Created At</th>
            <th>Earned Credits</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appContext.state.referrals.data.map(renderReferralTableRow)}
        </tbody>
      </table>
    </div>
  );
}

export default function ReferAFriend(props: DefaultProps) {
  return (
    <AuthPageContainer title="Refer a friend" {...props}>
      <div className="flex flex-col gap-5 py-10 px-5">
        <div>
          <h1 className="text-xl">Refer a friend</h1>
          <p className="max-w-prose">
            Invite your friends to Ai Portrait Studio and earn credits when they
            sign up and purchase credits.
          </p>
        </div>

        <InviteForm />

        <ReferralsTable />
      </div>
    </AuthPageContainer>
  );
}

export const getServerSideProps = withPageAuthRequired({
  returnTo: '/account',
  getServerSideProps: loadServerSideProps,
});
