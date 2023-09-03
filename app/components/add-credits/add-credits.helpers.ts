import { AppContext } from '@aa/context';
import { useContext, useState } from 'react';

export function useAddCreditsModal() {
  const { state, methods } = useContext(AppContext);

  const [credits, setCredits] = useState(10);

  const continueToCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await methods.addCredits(credits);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredits(parseInt(e.target.value));
  };

  return {
    isLoading: state.credits.isLoading,
    continueToCheckout,
    credits,
    onChange,
  };
}
