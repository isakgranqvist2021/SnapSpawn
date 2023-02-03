import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import React from 'react';

import {
  AddCreditsButton,
  AddCreditsListItem,
  AddCreditsModal,
} from './add-credits';
import {
  GenerateAvatarListItem,
  GenerateAvatarModal,
  GenerateAvatarsButton,
} from './generate-avatars';

function NavDropDown() {
  const { isLoading, user } = useUser();

  return (
    <div className="dropdown dropdown-end">
      {!isLoading && user?.picture && (
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img src={user.picture} />
          </div>
        </label>
      )}
      <ul
        tabIndex={0}
        className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
      >
        <AddCreditsListItem />

        <GenerateAvatarListItem />

        <li>
          <Link href="/account">My Avatars</Link>
        </li>
        <li>
          <Link href="/api/auth/logout">Logout</Link>
        </li>
      </ul>
    </div>
  );
}

export function Nav() {
  return (
    <React.Fragment>
      <AddCreditsModal />
      <GenerateAvatarModal />

      <div className="navbar bg-base-100">
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
    </React.Fragment>
  );
}
