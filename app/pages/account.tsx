import {
  Drawer,
  DrawerContent,
  DrawerContext,
  DrawerFooter,
  DrawerProvider,
} from '@aa/components/drawer';
import { Spinner } from '@aa/components/spinner';
import {
  AuthPageContainer,
  DefaultProps,
} from '@aa/containers/auth-page-container';
import { AppContext } from '@aa/context';
import { useDropzone } from '@aa/hooks/use-dropzone';
import {
  useGenerateAvatar,
  useGenerateCustomPicture,
} from '@aa/hooks/use-generate-avatar';
import { useUploadFiles } from '@aa/hooks/use-upload-files';
import { AvatarModel } from '@aa/models/avatar';
import {
  Characteristic,
  Gender,
  GeneralAvatarModel,
  Traits,
  characteristics,
  genders,
  traits,
} from '@aa/models/prompt';
import { loadServerSideProps } from '@aa/utils';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import Image from 'next/image';
import {
  Fragment,
  PropsWithChildren,
  Reducer,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

function formatTimestampWithIntl(timestamp: number) {
  const date = new Date(timestamp);

  const locale = globalThis.navigator?.language ?? 'en-US';

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function constructTreeAsList(avatars: AvatarModel[]): AvatarModel[] {
  const flatTree: AvatarModel[] = [];

  const addToFlatTree = (avatar: AvatarModel) => {
    flatTree.push(avatar);

    avatars
      .filter((child) => child.parentId === avatar.id)
      .forEach((child) => addToFlatTree(child));
  };

  avatars.forEach((avatar) => {
    if (avatar.parentId === null) {
      addToFlatTree(avatar);
    }
  });

  return flatTree;
}

type GenerateAvatarMode = 'custom' | 'generate';

type ReducerAction =
  | { isLoading: boolean; type: 'set:isLoading' }
  | { traits: Traits; type: 'set:traits' }
  | { gender: Gender; type: 'set:gender' }
  | { characteristics: Characteristic; type: 'set:characteristics' }
  | { type: 'toggle:custom-prompt' }
  | { type: 'set:custom-prompt'; customPrompt: string }
  | { type: 'set:mode'; mode: GenerateAvatarMode };

const DEFAULT_FORM_STATE: GeneralAvatarModel = {
  characteristics: 'afrofuturism',
  gender: 'female',
  traits: 'beard',
};

interface GenerateAvatarState {
  customPrompt: string | null;
  form: GeneralAvatarModel;
  mode: GenerateAvatarMode;
}

interface GenerateAvatarContextType {
  dispatch: React.Dispatch<ReducerAction>;
  state: GenerateAvatarState;
}

const INITIAL_STATE: GenerateAvatarState = {
  customPrompt: null,
  form: DEFAULT_FORM_STATE,
  mode: 'generate',
};

const GenerateAvatarContext = createContext<GenerateAvatarContextType>({
  dispatch: () => {},
  state: INITIAL_STATE,
});

function reducer(
  state: GenerateAvatarState,
  action: ReducerAction,
): GenerateAvatarState {
  switch (action.type) {
    case 'set:traits':
      return { ...state, form: { ...state.form, traits: action.traits } };

    case 'set:gender':
      return { ...state, form: { ...state.form, gender: action.gender } };

    case 'set:characteristics':
      return {
        ...state,
        form: { ...state.form, characteristics: action.characteristics },
      };

    case 'toggle:custom-prompt':
      return {
        ...state,
        customPrompt: state.customPrompt === null ? '' : null,
      };

    case 'set:custom-prompt':
      return {
        ...state,
        customPrompt: action.customPrompt.length ? action.customPrompt : null,
      };

    case 'set:mode':
      return { ...state, mode: action.mode };

    default:
      return state;
  }
}

function GenerateAvatarProvider(props: PropsWithChildren) {
  const { children } = props;

  const [state, dispatch] = useReducer<
    Reducer<GenerateAvatarState, ReducerAction>
  >(reducer, INITIAL_STATE);

  return (
    <GenerateAvatarContext.Provider value={{ dispatch, state }}>
      {children}
    </GenerateAvatarContext.Provider>
  );
}

function PickGender() {
  const generateAvatarContext = useContext(GenerateAvatarContext);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    generateAvatarContext.dispatch({
      gender: e.target.value as Gender,
      type: 'set:gender',
    });
  };

  const renderGenderOption = (gender: Gender) => {
    return (
      <option className="capitalize" value={gender} key={gender}>
        {gender}
      </option>
    );
  };

  return (
    <div className="form-control">
      <label className="label">Pick Gender</label>
      <select
        value={generateAvatarContext.state.form.gender}
        onChange={onChange}
        className="select select-bordered capitalize"
      >
        <option disabled selected>
          Pick one
        </option>

        {genders.map(renderGenderOption)}
      </select>
    </div>
  );
}

function PickTraits() {
  const generateAvatarContext = useContext(GenerateAvatarContext);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    generateAvatarContext.dispatch({
      traits: e.target.value as Traits,
      type: 'set:traits',
    });
  };

  const renderTraitOption = (trait: Traits) => {
    return (
      <option className="capitalize" value={trait} key={trait}>
        {trait}
      </option>
    );
  };

  return (
    <div className="form-control">
      <label className="label">Pick Theme</label>
      <select
        value={generateAvatarContext.state.form.traits}
        onChange={onChange}
        className="select select-bordered capitalize"
      >
        <option disabled selected>
          Pick one
        </option>

        {traits.map(renderTraitOption)}
      </select>
    </div>
  );
}

function PickCharacteristics() {
  const generateAvatarContext = useContext(GenerateAvatarContext);

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    generateAvatarContext.dispatch({
      characteristics: e.target.value as Characteristic,
      type: 'set:characteristics',
    });
  };

  const renderCharacteristicOption = (characteristic: Characteristic) => {
    return (
      <option
        className="capitalize"
        value={characteristic}
        key={characteristic}
      >
        {characteristic}
      </option>
    );
  };

  return (
    <div className="form-control">
      <label className="label">Pick Accessory</label>
      <select
        value={generateAvatarContext.state.form.characteristics}
        onChange={onChange}
        className="select select-bordered capitalize"
      >
        <option disabled selected>
          Pick one
        </option>

        {characteristics.map(renderCharacteristicOption)}
      </select>
    </div>
  );
}

function GenerateAvatarSubmitButton(props: { text: string }) {
  const { text } = props;

  const appContext = useContext(AppContext);
  const drawerContext = useContext(DrawerContext);
  const generateAvatarContext = useContext(GenerateAvatarContext);

  const generateAvatars = useGenerateAvatar();
  const generateCustomPicture = useGenerateCustomPicture();

  const handleSubmit = () => {
    window.scrollTo(0, 0);
    drawerContext.closeDrawer();

    generateAvatarContext.state.mode === 'generate'
      ? generateAvatars(generateAvatarContext.state.form)
      : generateCustomPicture(generateAvatarContext.state.customPrompt!);
  };

  if (appContext.state.credits.data === 0) {
    return (
      <button className="btn btn-secondary" disabled>
        You have no credits
      </button>
    );
  }

  return (
    <button
      className="btn btn-secondary relative"
      disabled={appContext.state.avatars.isLoading}
      onClick={handleSubmit}
      type="submit"
    >
      {appContext.state.avatars.isLoading && (
        <div className="absolute z-10">
          <Spinner />
        </div>
      )}

      <span className={appContext.state.avatars.isLoading ? 'opacity-0' : ''}>
        {text}
      </span>
    </button>
  );
}

function UserCreditsText() {
  const appContext = useContext(AppContext);

  if (!appContext.state.credits.data) {
    return (
      <h1 className="text-2xl mt-3 text-center">
        You have <span className="text-secondary">0</span> credits
      </h1>
    );
  }

  return (
    <h1 className="text-2xl text-center">
      You have{' '}
      <span className="text-secondary">{appContext.state.credits.data}</span>{' '}
      credits
    </h1>
  );
}

function CustomPromptTextarea() {
  const appContext = useContext(AppContext);
  const generateAvatarContext = useContext(GenerateAvatarContext);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    generateAvatarContext.dispatch({
      type: 'set:custom-prompt',
      customPrompt: e.target.value,
    });
  };

  return (
    <textarea
      className="textarea textarea-bordered h-24 resize w-full"
      disabled={appContext.state.avatars.isLoading}
      onChange={onChange}
      placeholder="Enter custom prompt here"
      value={generateAvatarContext.state.customPrompt ?? ''}
    ></textarea>
  );
}

function GenerateFromPreDefinedOptionsForm() {
  return (
    <Fragment>
      <PickGender />

      <PickTraits />

      <PickCharacteristics />
    </Fragment>
  );
}

function CustomPromptForm() {
  return (
    <div className="flex flex-col gap-5">
      <CustomPromptTextarea />
    </div>
  );
}

function FormFooter() {
  const drawerContext = useContext(DrawerContext);

  return (
    <DrawerFooter>
      <button
        onClick={drawerContext.closeDrawer}
        type="button"
        className="btn btn-outline btn-error"
      >
        Cancel
      </button>

      <GenerateAvatarSubmitButton text="Generate" />
    </DrawerFooter>
  );
}

function Form() {
  const generateAvatarContext = useContext(GenerateAvatarContext);
  const drawerContext = useContext(DrawerContext);

  const generateAvatars = useGenerateAvatar();
  const generateCustomPicture = useGenerateCustomPicture();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    window.scrollTo(0, 0);
    drawerContext.closeDrawer();

    generateAvatarContext.state.mode === 'generate'
      ? generateAvatars(generateAvatarContext.state.form)
      : generateCustomPicture(generateAvatarContext.state.customPrompt!);
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {generateAvatarContext.state.mode === 'generate' ? (
        <GenerateFromPreDefinedOptionsForm />
      ) : (
        <CustomPromptForm />
      )}
    </form>
  );
}

function TabHeader() {
  const generateAvatarContext = useContext(GenerateAvatarContext);

  const setModeAsCustom = () => {
    generateAvatarContext.dispatch({ type: 'set:mode', mode: 'custom' });
  };

  const setModeAsGenerate = () => {
    generateAvatarContext.dispatch({ type: 'set:mode', mode: 'generate' });
  };

  return (
    <div className="flex gap-3 justify-center flex-wrap">
      <button
        className={
          generateAvatarContext.state.mode === 'generate'
            ? 'btn btn-sm btn-outline'
            : 'btn btn-sm'
        }
        onClick={setModeAsGenerate}
      >
        Pre Defined Prompts
      </button>
      <button
        className={
          generateAvatarContext.state.mode === 'custom'
            ? 'btn btn-sm btn-outline'
            : 'btn btn-sm'
        }
        onClick={setModeAsCustom}
      >
        Custom Prompt
      </button>
    </div>
  );
}

function GenerateAvatarsFormContent() {
  return (
    <Drawer position="left">
      <DrawerContent>
        <TabHeader />

        <UserCreditsText />

        <Form />

        <a
          className="link link-primary text-center"
          target="_blank"
          rel="noreferrer"
          href="/The-DALL·E-2-prompt-book-v1.02.pdf"
        >
          The Dall-E prompt Book
        </a>
      </DrawerContent>

      <FormFooter />
    </Drawer>
  );
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
                    .sort((a, b) => {
                      const aSize = parseInt(a.split('x')[0]);
                      const bSize = parseInt(b.split('x')[0]);

                      return bSize - aSize;
                    })
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
                  {!appContext.state.credits.data
                    ? 'You have no credits'
                    : 'Generate variant'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Image
        alt="Ai generated avatar"
        className="cursor-pointer ease-in-out transition-all duration-200 rounded-lg outline outline-4 outline-transparent hover:outline-primary"
        height={128}
        loading="lazy"
        onClick={openFullscreen}
        src={urls['128x128']}
        width={128}
        style={{ maxWidth: 128, maxHeight: 128 }}
      />
    </Fragment>
  );
}

function renderAvatar(avatar: AvatarModel) {
  return <AvatarCard {...avatar} key={avatar.id} />;
}

function FirstAvatarGridItem() {
  const appContext = useContext(AppContext);
  const drawerContext = useContext(DrawerContext);

  if (appContext.state.upload.isLoading) {
    return (
      <div
        style={{ width: 128, height: 128 }}
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
        style={{ width: 128, height: 128 }}
        className="flex flex-col gap-2 justify-center items-center rounded-lg outline outline-4 outline-accent"
      >
        <Spinner />
        <p>Generating</p>
      </div>
    );
  }

  return (
    <div
      style={{ width: 128, height: 128 }}
      className="flex flex-col gap-2 justify-center items-center ease-in-out transition-all duration-200 rounded-lg cursor-pointer outline outline-4 outline-accent hover:outline-accent-focus"
      onClick={drawerContext.openDrawer}
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

function Avatars() {
  const appContext = useContext(AppContext);

  const flatTree = useMemo(
    () => constructTreeAsList(appContext.state.avatars.data),
    [appContext.state.avatars.data],
  );

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <FirstAvatarGridItem />

      {flatTree.map(renderAvatar)}
    </div>
  );
}

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
      className="text-center p-5 bg-base-200 w-full flex flex-col items-center items-center h-60 justify-center ease-in-out"
      ref={dropzoneRef}
    >
      <input
        hidden
        onChange={onFileInputChange}
        ref={fileInputRef}
        type="file"
      />

      <div ref={contentRef} className="flex flex-col gap-5 items-center">
        <h3 className="md:text-3xl text-xl">
          Upload image and generate variants based on it.
        </h3>

        <button onClick={openFileInput} className="btn btn-primary">
          Upload Image
        </button>
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

export default function Account(props: DefaultProps) {
  return (
    <AuthPageContainer title="Account" {...props}>
      <DrawerProvider>
        <div className="flex flex-col gap-5 w-full p-5">
          <UploadImage />

          <Avatars />
        </div>

        <GenerateAvatarProvider>
          <GenerateAvatarsFormContent />
        </GenerateAvatarProvider>
      </DrawerProvider>
    </AuthPageContainer>
  );
}

export const getServerSideProps = withPageAuthRequired({
  returnTo: '/account',
  getServerSideProps: loadServerSideProps,
});
