import { COIN_FACTOR } from '@aa/constants';
import { AppContext } from '@aa/context';
import { useAddCredits } from '@aa/hooks/use-add-credits';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Drawer, DrawerContent, DrawerFooter } from './drawer';
import { Spinner } from './spinner';

const MAX_CREDITS = 10000000;
const MIN_CREDITS = 20;

export const AddCreditsDrawerContext = React.createContext({
  isOpen: false,
  closeDrawer: () => {},
  openDrawer: () => {},
});

export function AddCreditsDrawerProvider(props: React.PropsWithChildren) {
  const { children } = props;

  const [isOpen, setIsOpen] = React.useState(false);

  const closeDrawer = () => setIsOpen(false);

  const openDrawer = () => setIsOpen(true);

  return (
    <AddCreditsDrawerContext.Provider
      value={{ isOpen, closeDrawer, openDrawer }}
    >
      {children}
    </AddCreditsDrawerContext.Provider>
  );
}

export const GeneratePictureDrawerContext = React.createContext({
  isOpen: false,
  closeDrawer: () => {},
  openDrawer: () => {},
});

export function GeneratePictureDrawerProvider(props: React.PropsWithChildren) {
  const { children } = props;

  const [isOpen, setIsOpen] = React.useState(false);

  const closeDrawer = () => setIsOpen(false);

  const openDrawer = () => setIsOpen(true);

  return (
    <GeneratePictureDrawerContext.Provider
      value={{ isOpen, closeDrawer, openDrawer }}
    >
      {children}
    </GeneratePictureDrawerContext.Provider>
  );
}

function AddCreditsForm() {
  const addCreditsDrawerContext = React.useContext(AddCreditsDrawerContext);

  const appContext = React.useContext(AppContext);

  const [credits, setCredits] = React.useState(100);

  const addCredits = useAddCredits();

  const continueToCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
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
      className="grow flex flex-col justify-between"
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
          onClick={addCreditsDrawerContext.closeDrawer}
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
  const addCreditsDrawerContext = React.useContext(AddCreditsDrawerContext);
  const appContext = React.useContext(AppContext);

  return (
    <div className="dropdown dropdown-end md:hidden">
      <UserProfileImage />

      <ul
        className="mt-3 p-2 shadow menu menu-compact dropdown-content text-primary bg-base-100 rounded-box w-52"
        tabIndex={0}
      >
        <li className="text-base-content">
          <Link className="w-full" href="/studio">
            Studio
          </Link>
        </li>

        {user && (
          <li
            className="text-base-content"
            onClick={addCreditsDrawerContext.openDrawer}
          >
            <a role="button" className="w-full">
              {appContext.state.credits.data} credits
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

function AddCreditsDrawer() {
  const addCreditsDrawerContext = React.useContext(AddCreditsDrawerContext);

  return (
    <Drawer
      isOpen={addCreditsDrawerContext.isOpen}
      onClose={addCreditsDrawerContext.closeDrawer}
      position="right"
    >
      <AddCreditsForm />
    </Drawer>
  );
}

function NavMenu() {
  const { user } = useUser();

  const addCreditsDrawerContext = React.useContext(AddCreditsDrawerContext);
  const appContext = React.useContext(AppContext);

  if (user) {
    return (
      <React.Fragment>
        <li className="hidden md:flex">
          <Link href="/studio">Studio</Link>
        </li>
        <li
          className="hidden md:flex"
          onClick={addCreditsDrawerContext.openDrawer}
        >
          <a role="button">{appContext.state.credits.data} credits</a>
        </li>
        <li className="hidden md:flex">
          <Link href="/api/auth/logout">Logout</Link>
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
  return (
    <React.Fragment>
      <div className="navbar bg-base-200 flex fixed top-0 w-100" {...props}>
        <div className="flex-1">
          <Link
            href="/"
            className="btn btn-ghost normal-case text-xl hidden lg:flex"
          >
            SnapSpawn
          </Link>
        </div>

        <div className="flex-none gap-2">
          <ul className="menu menu-horizontal px-1">
            <NavMenu />
            <NavMenuDropDown />
          </ul>
        </div>
      </div>

      <AddCreditsDrawer />
    </React.Fragment>
  );
}
