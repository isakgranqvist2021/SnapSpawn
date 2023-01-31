import { Spinner } from '@aa/components/spinner';
import { AppConsumer, AppContextType } from '@aa/context';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';

const userCredits = (appContext: AppContextType) => (
  <p className="font-medium">Credits: {appContext.state.credits}</p>
);

function UserCredits() {
  return <AppConsumer>{userCredits}</AppConsumer>;
}

export function UserProfile() {
  const { user, error, isLoading } = useUser();

  const router = useRouter();

  if (isLoading) return <Spinner />;

  if (error) {
    router.replace('/error');
    return <Spinner />;
  }

  if (!user) {
    router.replace('/error');
    return <Spinner />;
  }

  return (
    <div className="flex gap-3 items-center border-b-2 py-2">
      <UserCredits />
      <p className="font-medium">{user.email}</p>
    </div>
  );
}
