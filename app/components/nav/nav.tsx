import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import Link from 'next/link';
import React, { PropsWithChildren } from 'react';

import {
  AddCreditsBottomNavButton,
  AddCreditsButton,
  AddCreditsModal,
} from './add-credits';
import {
  GenerateAvatarModal,
  GenerateAvatarsBottomNavButton,
  GenerateAvatarsButton,
} from './generate-avatars';

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
              width={40}
              height={40}
              src={user.picture}
              alt="User profile image"
            />
          </div>
        </label>
      )}
      <ul
        tabIndex={0}
        className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
      >
        <li>
          <LogoutLink>Logout</LogoutLink>
        </li>
      </ul>
    </div>
  );
}

function LogoutButtomNavButton() {
  return (
    <LogoutLink className="text-error">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
        />
      </svg>
    </LogoutLink>
  );
}

export function Nav() {
  return (
    <React.Fragment>
      <AddCreditsModal />
      <GenerateAvatarModal />

      <div className="navbar bg-base-100 flex hidden md:flex">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost normal-case text-xl">
            AI Portrait Studio
          </Link>
        </div>

        <div className="flex-none gap-2">
          <AddCreditsButton />
          <GenerateAvatarsButton />
          <NavDropDown />
        </div>
      </div>

      <div className="btm-nav md:hidden z-10">
        <AddCreditsBottomNavButton />

        <GenerateAvatarsBottomNavButton />

        <LogoutButtomNavButton />
      </div>
    </React.Fragment>
  );
}
