import { AppContext } from '@aa/context';
import { AvatarModel } from '@aa/models/avatar';
import { useContext } from 'react';

export const useUploadFiles = () => {
  const appContext = useContext(AppContext);

  return async (files: FileList) => {
    if (files.length > 5) {
      appContext.dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'error',
          message: 'You can only upload up to 5 files at a time.',
        },
      });
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > 10000000) continue;

      switch (file.type) {
        case 'image/png':
        case 'image/jpeg':
        case 'image/jpg':
          formData.append('files', file);
          break;

        default:
          appContext.dispatch({
            type: 'alerts:add',
            alert: {
              severity: 'error',
              message: `File ${file.name} is not allowed.`,
            },
          });
          break;
      }
    }

    try {
      appContext.dispatch({ type: 'upload:set-is-loading', isLoading: true });

      const res = await fetch('/api/upload', {
        body: formData,
        method: 'POST',
      });

      if (res.status !== 200) {
        throw new Error('Invalid response');
      }

      const data: { avatars: AvatarModel[] } | undefined = await res.json();

      if (!data || !Array.isArray(data.avatars)) {
        throw new Error('Invalid response');
      }

      appContext.dispatch({ type: 'avatars:add', avatars: data.avatars });
      appContext.dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'success',
          message: 'Upload success!',
        },
      });
      appContext.dispatch({ type: 'upload:set-is-loading', isLoading: false });

      return data.avatars;
    } catch {
      appContext.dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'error',
          message: 'Something went wrong. Please try again later.',
        },
      });
      appContext.dispatch({ type: 'upload:set-is-loading', isLoading: false });

      return null;
    }
  };
};
