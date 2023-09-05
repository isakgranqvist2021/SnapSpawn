import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function UserProfileImage() {
  const { isLoading, user } = useUser();

  if (isLoading || !user?.picture) {
    return (
      <div
        tabIndex={0}
        className="w-10 h-10 rounded-full bg-neutral flex justify-center items-center avatar btn-ghost btn p-0 line-height-0 min-h-0 hover:bg-neutral-focus tooltip"
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
  }

  return (
    <label
      tabIndex={0}
      className="btn btn-ghost btn-circle avatar tooltip tooltip-left flex"
      data-tip={user.email}
    >
      <div className="w-10 rounded-full">
        <Image
          alt="User profile image"
          height={40}
          src={user.picture}
          width={40}
        />
      </div>
    </label>
  );
}

function NavMenuDropDown() {
  const { user } = useUser();

  return (
    <div className="dropdown dropdown-end md:hidden">
      <UserProfileImage />

      <ul
        className="mt-3 p-2 shadow menu menu-compact dropdown-content text-primary bg-base-100 rounded-box w-52"
        tabIndex={0}
      >
        <li className="text-base-content">
          <Link className="w-full" href="/account">
            Avatar Studio
          </Link>
        </li>

        <li className="text-base-content">
          <Link className="w-full" href="/refill">
            Add Credits
          </Link>
        </li>

        <li className="text-base-content">
          {user ? (
            <Link className="w-full" href="/api/auth/logout">
              Logout
            </Link>
          ) : (
            <Link className="w-full" href="/api/auth/login">
              Log In
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
}

function NavMenu() {
  const { user } = useUser();

  if (user) {
    return (
      <React.Fragment>
        <li className="hidden md:flex">
          <Link href="/account">
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
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            Avatar Studio
          </Link>
        </li>
        <li className="hidden md:flex">
          <Link href="/refill">
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
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Add Credits
          </Link>
        </li>
      </React.Fragment>
    );
  }

  return (
    <li className="hidden md:flex">
      <Link href="/api/auth/login">Log In</Link>
    </li>
  );
}

export function Nav(props: React.ComponentPropsWithoutRef<'div'>) {
  const { user } = useUser();

  return (
    <div className="navbar bg-base-200 flex" {...props}>
      <div className="flex-1">
        <Link
          href={!user ? '/' : '/account'}
          className="btn btn-ghost normal-case text-xl"
        >
          AI Portrait Studio
        </Link>
      </div>

      <div className="flex-none gap-2">
        <ul className="menu menu-horizontal px-1">
          <NavMenu />
          <NavMenuDropDown />
        </ul>
      </div>
    </div>
  );
}
