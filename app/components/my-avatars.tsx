import { AppContext, ContentSidebarContext } from '@aa/context';
import { useDropzone } from '@aa/hooks/use-dropzone';
import { useUploadFiles } from '@aa/hooks/use-upload-files';
import { AvatarModel } from '@aa/models/avatar';
import Image from 'next/image';
import React, { Fragment, useContext, useEffect, useMemo, useRef } from 'react';
import { useState } from 'react';

import { EmptyState } from './empty-state';
import { Spinner } from './spinner';

function formatTimestampWithIntl(timestamp: number) {
  const date = new Date(timestamp);

  const locale = globalThis.navigator?.language ?? 'en-US';

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function sortUrlsBySize(a: string, b: string) {
  const aSize = parseInt(a.split('x')[0]);
  const bSize = parseInt(b.split('x')[0]);

  return bSize - aSize;
}

function AvatarCard(props: AvatarModel) {
  const { id, urls, createdAt, prompt } = props;

  const appContext = useContext(AppContext);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const generateVariant = async () => {
    closeFullscreen();
    window.scrollTo(0, 0);

    try {
      appContext.dispatch({ type: 'avatars:set-is-loading', isLoading: true });

      const res = await fetch('/api/create-variant', {
        body: JSON.stringify({ id }),
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
        type: 'credits:reduce',
        reduceCreditsBy: data.avatars.length,
      });
      appContext.dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'success',
          message: 'Variant generated successfully!',
        },
      });
      appContext.dispatch({ type: 'avatars:set-is-loading', isLoading: false });

      return data.avatars;
    } catch {
      appContext.dispatch({
        type: 'alerts:add',
        alert: {
          severity: 'error',
          message: 'Something went wrong. Please try again later.',
        },
      });
      appContext.dispatch({ type: 'avatars:set-is-loading', isLoading: false });

      return null;
    }
  };

  const renderDownloadLink = (key: string) => {
    return (
      <a
        className="link link-secondary"
        download
        href={urls[key as keyof typeof urls]}
        key={key}
        rel="noreferrer"
        target="_blank"
      >
        {key}
      </a>
    );
  };

  useEffect(() => {
    const onKeyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeFullscreen();
      }
    };

    window.addEventListener('keydown', onKeyDownHandler);

    return () => {
      window.removeEventListener('keydown', onKeyDownHandler);
    };
  }, []);

  return (
    <Fragment>
      {isFullscreen && (
        <div>
          <button
            onClick={closeFullscreen}
            className="btn btn-circle btn-primary fixed top-10 right-10 z-30"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div
            onClick={closeFullscreen}
            className="z-10 fixed inset-0"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            }}
          ></div>

          <div className="fixed inset-8 z-20 p-5 bg-base-200 flex flex-col items-center">
            <div className="h-4/6 flex flex-col items-center gap-3">
              <img
                className="object-fit max-h-full"
                alt="Ai generated avatar"
                loading="lazy"
                src={urls['1024x1024']}
              />

              <div className="max-w-prose text-center flex flex-col gap-2">
                <p className="content-base-300">
                  {formatTimestampWithIntl(createdAt)}
                </p>

                <p className="content-base-200">{prompt}</p>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex gap-5 flex-wrap justify-center">
                  {Object.keys(urls)
                    .sort(sortUrlsBySize)
                    .map(renderDownloadLink)}
                </div>

                <button
                  onClick={generateVariant}
                  className="btn btn-primary"
                  disabled={
                    !appContext.state.credits.data ||
                    appContext.state.avatars.isLoading
                  }
                >
                  Generate variant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Image
        alt="Ai generated avatar"
        className="cursor-pointer ease-in-out transition-all duration-200 rounded-lg outline outline-4 outline-transparent hover:outline-primary"
        height={144}
        loading="lazy"
        onClick={openFullscreen}
        src={urls['128x128']}
        width={144}
        style={{ maxWidth: 144, maxHeight: 144 }}
      />
    </Fragment>
  );
}

function renderAvatar(avatar: AvatarModel) {
  return <AvatarCard {...avatar} key={avatar.id} />;
}

const avatarsEmptyState = (
  <EmptyState
    message="You have no pictures yet. Generate one now!"
    buttonText="Generate Picture"
  />
);

function FirstAvatarGridItem() {
  const appContext = useContext(AppContext);
  const contentSidebarContext = useContext(ContentSidebarContext);

  if (appContext.state.upload.isLoading) {
    return (
      <div
        style={{ width: 144, height: 144 }}
        className="flex flex-col gap-2 justify-center items-center rounded-lg outline outline-4 outline-accent"
      >
        <Spinner />
        <p>Uploading</p>
      </div>
    );
  }

  if (appContext.state.avatars.isLoading) {
    return (
      <div
        style={{ width: 144, height: 144 }}
        className="flex flex-col gap-2 justify-center items-center rounded-lg outline outline-4 outline-accent"
      >
        <Spinner />
        <p>Generating</p>
      </div>
    );
  }

  const openSidebar = () => contentSidebarContext.setIsOpen(true);

  return (
    <div
      style={{ width: 144, height: 144 }}
      className="flex flex-col gap-2 justify-center items-center ease-in-out transition-all duration-200 rounded-lg cursor-pointer outline outline-4 outline-accent hover:outline-accent-focus"
      onClick={openSidebar}
      role="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );
}

interface AvatarNode extends AvatarModel {
  nodes: AvatarNode[] | null;
}

function constructTree(
  avatars: AvatarModel[],
  parentId: string | null = null,
): AvatarNode[] {
  const tree: AvatarNode[] = [];

  avatars.forEach((avatar) => {
    if (avatar.parentId === parentId) {
      const childNodes = constructTree(avatars, avatar.id);
      tree.push({ ...avatar, nodes: childNodes.length ? childNodes : null });
    }
  });

  return tree;
}

function renderTreeNode(node: AvatarNode) {
  return <TreeNode {...node} key={node.id} />;
}

function TreeNode(props: AvatarNode) {
  const { nodes, ...rest } = props;

  return (
    <React.Fragment>
      {renderAvatar(rest)}

      {nodes?.map(renderTreeNode)}
    </React.Fragment>
  );
}

function Avatars() {
  const appContext = useContext(AppContext);

  const tree = useMemo(
    () => constructTree(appContext.state.avatars.data),
    [appContext.state.avatars.data],
  );

  if (!appContext.state.avatars.data.length && !appContext.state.credits.data) {
    return avatarsEmptyState;
  }

  return (
    <div className="flex flex-wrap gap-4">
      <FirstAvatarGridItem />

      {tree.map(renderTreeNode)}
    </div>
  );
}

const creditsEmptyState = (
  <EmptyState
    message="You have no credits yet. Add some now!"
    buttonHref="/refill"
    buttonText="Add Credits"
  />
);

function UploadImage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const uploadIconRef = useRef<SVGSVGElement>(null);

  const openFileInput = () => fileInputRef.current?.click();

  const uploadFiles = useUploadFiles();

  const onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    uploadFiles(e.target.files);
  };

  const dropzoneRef = useDropzone({
    onDrop: (e, ref) => {
      ref.current?.classList.remove('bg-base-300');
      contentRef.current?.classList.remove('hidden');
      uploadIconRef.current?.classList.add('hidden');

      if (!e.dataTransfer?.files) return;

      uploadFiles(e.dataTransfer.files);
    },
    onDragEnter: (_, ref) => {
      ref.current?.classList.add('bg-base-300');
      contentRef.current?.classList.add('hidden');
      uploadIconRef.current?.classList.remove('hidden');
    },
    onDragLeave: (_, ref) => {
      ref.current?.classList.remove('bg-base-300');
      contentRef.current?.classList.remove('hidden');
      uploadIconRef.current?.classList.add('hidden');
    },
  });

  return (
    <div
      className="text-center p-5 bg-base-200 w-full flex flex-col items-center items-center h-60 justify-center cursor-pointer ease-in-out"
      onClick={openFileInput}
      ref={dropzoneRef}
    >
      <input
        hidden
        onChange={onFileInputChange}
        ref={fileInputRef}
        type="file"
      />

      <div ref={contentRef} className="flex flex-col gap-5 items-center">
        <h3 className="text-3xl">
          Upload image and generate variants based on it.
        </h3>

        <button className="btn btn-primary">Upload Image</button>
      </div>

      <svg
        ref={uploadIconRef}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-24 h-24 hidden"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
        />
      </svg>
    </div>
  );
}

export function MyAvatars() {
  const appContext = useContext(AppContext);

  return (
    <div className="flex flex-col gap-5 w-full p-5">
      {appContext.state.credits.data === 0 && creditsEmptyState}

      <UploadImage />

      <Avatars />
    </div>
  );
}
