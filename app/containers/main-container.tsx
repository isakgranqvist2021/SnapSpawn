import { useDropzone } from '@aa/hooks/use-dropzone';
import { useUploadFiles } from '@aa/hooks/use-upload-files';
import { PropsWithChildren, useRef } from 'react';

export function MainContainerContent(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div className="flex flex-col items-center flex-grow bg-base-100">
      {children}
    </div>
  );
}

export function MainContainerLayout(props: PropsWithChildren) {
  const { children } = props;

  return <div className="flex bg-white flex-auto mt-16">{children}</div>;
}

export function MainContainer(props: PropsWithChildren) {
  const { children } = props;

  const uploadFiles = useUploadFiles();

  const dropzoneRef = useDropzone({
    onDrop: (e) => {
      if (!e.dataTransfer?.files) return;

      uploadFiles(e.dataTransfer.files);
    },
  });

  return (
    <main
      ref={dropzoneRef}
      className="min-h-screen	justify-between flex flex-col bg-base-100"
    >
      {children}
    </main>
  );
}
