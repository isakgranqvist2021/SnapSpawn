import { COIN_FACTOR } from '@aa/constants';
import { AppContext } from '@aa/context';
import { useAddCredits } from '@aa/hooks/use-add-credits';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import Link from 'next/link';
import React, { FormEvent, useContext, useState } from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerContext,
  DrawerFooter,
  DrawerProvider,
} from './drawer';
import { Spinner } from './spinner';

const MAX_CREDITS = 10000000;
const MIN_CREDITS = 20;

function AddCreditsForm() {
  const drawerContext = useContext(DrawerContext);

  const appContext = useContext(AppContext);

  const [credits, setCredits] = useState(100);

  const addCredits = useAddCredits();

  const continueToCheckout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addCredits(credits);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredits(parseInt(e.target.value));
  };

  const getCheckoutButtonText = () => {
    if (appContext.state.credits.isLoading) {
      return 'Loading...';
    }

    if (!credits) {
      return 'Please enter a number';
    }

    if (credits < MIN_CREDITS) {
      return `Minimum ${MIN_CREDITS} credits`;
    }

    if (credits > MAX_CREDITS) {
      return `Maximum ${MAX_CREDITS} credits`;
    }

    return `Continue to checkout €${credits / COIN_FACTOR}`;
  };

  return (
    <form
      className="h-full flex flex-col justify-between"
      onSubmit={continueToCheckout}
    >
      <DrawerContent>
        <h1 className="text-3xl leading-10">Add Credits</h1>

        <div className="form-control">
          <label className="label">Number of credits</label>

          <input
            type="number"
            value={credits}
            onChange={onChange}
            className="input input-bordered w-full"
            min={MIN_CREDITS}
            max={MAX_CREDITS}
          />
        </div>
      </DrawerContent>

      <DrawerFooter>
        <button
          onClick={drawerContext.closeDrawer}
          type="button"
          className="btn btn-outline btn-error"
        >
          Cancel
        </button>

        <button
          disabled={
            appContext.state.credits.isLoading ||
            !credits ||
            credits < MIN_CREDITS ||
            credits > MAX_CREDITS
          }
          type="submit"
          className="btn btn-primary"
        >
          {appContext.state.credits.isLoading && (
            <div className="absolute z-10">
              <Spinner />
            </div>
          )}

          <span
            className={appContext.state.credits.isLoading ? 'opacity-0' : ''}
          >
            {getCheckoutButtonText()}
          </span>
        </button>
      </DrawerFooter>
    </form>
  );
}

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
  const drawerContext = useContext(DrawerContext);

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

        {user && (
          <li className="text-base-content" onClick={drawerContext.openDrawer}>
            <a role="button" className="w-full">
              Add Credits
            </a>
          </li>
        )}

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

  const drawerContext = useContext(DrawerContext);

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
        <li className="hidden md:flex" onClick={drawerContext.openDrawer}>
          <a role="button">
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
          </a>
        </li>
        <li className="hidden md:flex">
          <a href="/api/auth/logout">
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
            Logout
          </a>
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

function AddCreditsDrawer() {
  return (
    <Drawer position="right">
      <AddCreditsForm />
    </Drawer>
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
        <DrawerProvider>
          <ul className="menu menu-horizontal px-1">
            <NavMenu />
            <NavMenuDropDown />
          </ul>

          <AddCreditsDrawer />
        </DrawerProvider>
      </div>
    </div>
  );
}
