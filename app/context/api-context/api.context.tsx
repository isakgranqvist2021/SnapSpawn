import { PromptModel, Size } from '@aa/models';
import { createContext } from 'react';

import { ApiContextType } from './api.types';

export const AppContext = createContext<ApiContextType>({
  methods: {
    addCredits: async (credits: number) => {},
    clearAlert: (id: string) => {},
    generateAvatars: async (payload: PromptModel, size: Size, n: number) =>
      null,
    generateCustomPicture: async (payload: string, size: Size, n: number) =>
      null,
  },
  state: {
    alerts: [],
    avatars: { data: [], isLoading: false },
    credits: { data: 0, isLoading: false },
  },
});
