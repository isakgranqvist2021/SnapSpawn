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

function UserProfileImage() {
  const { isLoading, user } = useUser();

  // if (isLoading || !user?.picture) {
  return (
    <div
      tabIndex={0}
      className="w-10 h-10 rounded-full bg-neutral flex justify-center items-center avatar btn-ghost btn p-0 line-height-0 min-h-0 text-white hover:bg-neutral-focus"
    >
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
          d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </div>
  );
  // }

  // return (
  //   <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
  //     <div className="w-10 rounded-full">
  //       <Image
  //         alt="User profile image"
  //         height={40}
  //         src={user.picture}
  //         width={40}
  //       />
  //     </div>
  //   </label>
  // );
}

function NavDropDown() {
  return (
    <div className="dropdown dropdown-end">
      <UserProfileImage />

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
