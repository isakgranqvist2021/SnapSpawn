import { useUser } from '@auth0/nextjs-auth0/client';
import React from 'react';

import { AddCreditsButton, AddCreditsListItem } from './add-credits';
import {
  GenerateAvatarListItem,
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
          <a href="/account">My Avatars</a>
        </li>
        <li>
          <a href="/api/auth/logout">Logout</a>
        </li>
      </ul>
    </div>
  );
}

export function Nav() {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a href="/" className="btn btn-ghost normal-case text-xl">
          AI Avatar
        </a>
      </div>
      <div className="flex-none gap-2">
        <AddCreditsButton />
        <GenerateAvatarsButton />
        <NavDropDown />
      </div>
    </div>
  );
}
