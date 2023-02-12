import { useApiMethods, useApiState } from '@aa/context/api-context';
import { useState } from 'react';

export function useAddCreditsModal() {
  const [credits, setCredits] = useState(10);

  const apiState = useApiState();
  const apiMethods = useApiMethods();

  const continueToCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await apiMethods.addCredits(credits);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredits(parseInt(e.target.value));
  };

  return {
    isLoading: apiState.credits.isLoading,
    continueToCheckout,
    credits,
    onChange,
  };
}
