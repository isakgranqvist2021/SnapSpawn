import { CustomPrompt, PromptModel } from '@aa/models';
import { createContext } from 'react';

import { ApiContextType } from './api.types';

export const AppContext = createContext<ApiContextType>({
  methods: {
    addCredits: async (credits: number) => {},
    clearAlert: (id: string) => {},
    generateAvatars: async (payload: PromptModel) => null,
    generateCustomPicture: async (payload: CustomPrompt) => null,
  },
  state: {
    alerts: [],
    avatars: { data: [], isLoading: false },
    credits: { data: 0, isLoading: false },
  },
});
