import { AddCreditsModal } from '@aa/components/add-credits-modal';
import { AppContext } from '@aa/context';
import React, { useContext } from 'react';

export function AddCreditsButton() {
  const appContext = useContext(AppContext);

  return (
    <React.Fragment>
      <AddCreditsModal id="add-credits-modal" />
      <label
        htmlFor="add-credits-modal"
        className="btn btn-primary hidden md:flex"
      >
        Add Credits ({appContext.state.credits})
      </label>
    </React.Fragment>
  );
}

export function AddCreditsListItem() {
  const appContext = useContext(AppContext);

  return (
    <li className="md:hidden">
      <label htmlFor="add-credits-modal">
        Add Credits ({appContext.state.credits})
      </label>
    </li>
  );
}
