import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function LogoutLink(props: React.ComponentPropsWithoutRef<'a'>) {
  const { children, ...rest } = props;

  return (
    <Link href="/api/auth/logout" {...rest}>
      {children}
    </Link>
  );
}

function NavDropDown() {
  const { isLoading, user } = useUser();

  return (
    <div className="dropdown dropdown-end">
      {!isLoading && user?.picture && (
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <Image
              alt="User profile image"
              height={40}
              src={user.picture}
              width={40}
            />
          </div>
        </label>
      )}
      <ul
        className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
        tabIndex={0}
      >
        <li>
          <LogoutLink>Logout</LogoutLink>
        </li>
      </ul>
    </div>
  );
}

export function Nav() {
  return (
    <React.Fragment>
      <div className="navbar bg-base-200 flex">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost normal-case text-xl">
            AI Portrait Studio
          </Link>
        </div>

        <div className="flex-none gap-2">
          <NavDropDown />
        </div>
      </div>
    </React.Fragment>
  );
}
