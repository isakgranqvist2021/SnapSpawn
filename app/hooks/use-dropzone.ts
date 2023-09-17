import { useEffect, useRef } from 'react';

export function useDropzone(options: {
  onDrop: (e: DragEvent, ref: React.RefObject<HTMLDivElement>) => void;
  onDragEnter?: (e: DragEvent, ref: React.RefObject<HTMLDivElement>) => void;
  onDragLeave?: (e: DragEvent, ref: React.RefObject<HTMLDivElement>) => void;
}) {
  const dropzoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dropzone = dropzoneRef.current;

    if (!dropzone) {
      return;
    }

    const onDragOverHandler = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const onDropHandler = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      options.onDrop(e, dropzoneRef);
    };

    const onDragEnterHandler = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      options.onDragEnter?.(e, dropzoneRef);
    };

    const onDragLeaveHandler = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      options.onDragLeave?.(e, dropzoneRef);
    };

    dropzone.addEventListener('dragover', onDragOverHandler);
    dropzone.addEventListener('drop', onDropHandler);
    dropzone.addEventListener('dragenter', onDragEnterHandler);
    dropzone.addEventListener('dragleave', onDragLeaveHandler);

    return () => {
      dropzone.removeEventListener('dragover', onDragOverHandler);
      dropzone.removeEventListener('drop', onDropHandler);
      dropzone.removeEventListener('dragenter', onDragEnterHandler);
      dropzone.removeEventListener('dragleave', onDragLeaveHandler);
    };
  }, [dropzoneRef, options]);

  return dropzoneRef;
}
