import { COIN_FACTOR } from '@aa/constants';
import { AppContext } from '@aa/context';
import { useAddCredits } from '@aa/hooks/use-add-credits';
import {
  useGenerateAvatar,
  useGenerateCustomPicture,
} from '@aa/hooks/use-generate-avatar';
import { useUploadFiles } from '@aa/hooks/use-upload-files';
import {
  Characteristic,
  Gender,
  GeneralAvatarModel,
  Traits,
  characteristics,
  genders,
  traits,
} from '@aa/models/prompt';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import Link from 'next/link';
import React, {
  FormEvent,
  Fragment,
  PropsWithChildren,
  Reducer,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';

import { Drawer, DrawerContent, DrawerFooter } from './drawer';
import { Spinner } from './spinner';

const MAX_CREDITS = 10000000;
const MIN_CREDITS = 20;

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
  characteristics: '2014-era tumblr',
  gender: 'male',
  traits: 'baseball cap',
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

export const AddCreditsDrawerContext = createContext({
  isOpen: false,
  closeDrawer: () => {},
  openDrawer: () => {},
});

export function AddCreditsDrawerProvider(props: PropsWithChildren) {
  const { children } = props;

  const [isOpen, setIsOpen] = useState(false);

  const closeDrawer = () => setIsOpen(false);

  const openDrawer = () => setIsOpen(true);

  return (
    <AddCreditsDrawerContext.Provider
      value={{ isOpen, closeDrawer, openDrawer }}
    >
      {children}
    </AddCreditsDrawerContext.Provider>
  );
}

export const GeneratePictureDrawerContext = createContext({
  isOpen: false,
  closeDrawer: () => {},
  openDrawer: () => {},
});

export function GeneratePictureDrawerProvider(props: PropsWithChildren) {
  const { children } = props;

  const [isOpen, setIsOpen] = useState(false);

  const closeDrawer = () => setIsOpen(false);

  const openDrawer = () => setIsOpen(true);

  return (
    <GeneratePictureDrawerContext.Provider
      value={{ isOpen, closeDrawer, openDrawer }}
    >
      {children}
    </GeneratePictureDrawerContext.Provider>
  );
}

function AddCreditsForm() {
  const addCreditsDrawerContext = useContext(AddCreditsDrawerContext);

  const appContext = useContext(AppContext);

  const [credits, setCredits] = useState(100);

  const addCredits = useAddCredits();

  const continueToCheckout = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addCredits(credits);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredits(parseInt(e.target.value));
  };

  const getCheckoutButtonText = () => {
    if (appContext.state.credits.isLoading) {
      return 'Loading...';
    }

    if (!credits) {
      return 'Please enter a number';
    }

    if (credits < MIN_CREDITS) {
      return `Minimum ${MIN_CREDITS} credits`;
    }

    if (credits > MAX_CREDITS) {
      return `Maximum ${MAX_CREDITS} credits`;
    }

    return `Continue to checkout €${credits / COIN_FACTOR}`;
  };

  return (
    <form
      className="grow flex flex-col justify-between"
      onSubmit={continueToCheckout}
    >
      <DrawerContent>
        <h1 className="text-3xl leading-10">Add Credits</h1>

        <div className="form-control">
          <label className="label">Number of credits</label>

          <input
            type="number"
            value={credits}
            onChange={onChange}
            className="input input-bordered w-full"
            min={MIN_CREDITS}
            max={MAX_CREDITS}
          />
        </div>
      </DrawerContent>

      <DrawerFooter>
        <button
          onClick={addCreditsDrawerContext.closeDrawer}
          type="button"
          className="btn btn-outline btn-error"
        >
          Cancel
        </button>

        <button
          disabled={
            appContext.state.credits.isLoading ||
            !credits ||
            credits < MIN_CREDITS ||
            credits > MAX_CREDITS
          }
          type="submit"
          className="btn btn-primary"
        >
          {appContext.state.credits.isLoading && (
            <div className="absolute z-10">
              <Spinner />
            </div>
          )}

          <span
            className={appContext.state.credits.isLoading ? 'opacity-0' : ''}
          >
            {getCheckoutButtonText()}
          </span>
        </button>
      </DrawerFooter>
    </form>
  );
}

function UserProfileImage() {
  const { isLoading, user } = useUser();

  if (isLoading || !user?.picture) {
    return (
      <div
        tabIndex={0}
        className="w-10 h-10 rounded-full bg-neutral flex justify-center items-center avatar btn-ghost btn p-0 line-height-0 min-h-0 hover:bg-neutral-focus tooltip"
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
            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
    );
  }

  return (
    <label
      tabIndex={0}
      className="btn btn-ghost btn-circle avatar tooltip tooltip-left flex"
      data-tip={user.email}
    >
      <div className="w-10 rounded-full">
        <Image
          alt="User profile image"
          height={40}
          src={user.picture}
          width={40}
        />
      </div>
    </label>
  );
}

function NavMenuDropDown() {
  const { user } = useUser();
  const addCreditsDrawerContext = useContext(AddCreditsDrawerContext);

  return (
    <div className="dropdown dropdown-end md:hidden">
      <UserProfileImage />

      <ul
        className="mt-3 p-2 shadow menu menu-compact dropdown-content text-primary bg-base-100 rounded-box w-52"
        tabIndex={0}
      >
        <li className="text-base-content">
          <Link className="w-full" href="/account">
            Avatar Studio
          </Link>
        </li>

        {user && (
          <li
            className="text-base-content"
            onClick={addCreditsDrawerContext.openDrawer}
          >
            <a role="button" className="w-full">
              Add Credits
            </a>
          </li>
        )}

        <li className="text-base-content">
          {user ? (
            <Link className="w-full" href="/api/auth/logout">
              Logout
            </Link>
          ) : (
            <Link className="w-full" href="/api/auth/login">
              Log In
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
}

function AddCreditsDrawer() {
  const addCreditsDrawerContext = useContext(AddCreditsDrawerContext);

  return (
    <Drawer
      isOpen={addCreditsDrawerContext.isOpen}
      onClose={addCreditsDrawerContext.closeDrawer}
      position="right"
    >
      <AddCreditsForm />
    </Drawer>
  );
}

function NavMenu() {
  const { user } = useUser();

  const addCreditsDrawerContext = useContext(AddCreditsDrawerContext);

  if (user) {
    return (
      <React.Fragment>
        <li className="hidden md:flex">
          <Link href="/account">Avatar Studio</Link>
        </li>
        <li
          className="hidden md:flex"
          onClick={addCreditsDrawerContext.openDrawer}
        >
          <a role="button">Add Credits</a>
        </li>
        <li className="hidden md:flex">
          <Link href="/api/auth/logout">Logout</Link>
        </li>
      </React.Fragment>
    );
  }

  return (
    <li className="hidden md:flex">
      <Link href="/api/auth/login">Log In</Link>
    </li>
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
        {characteristics.map(renderCharacteristicOption)}
      </select>
    </div>
  );
}

function GenerateAvatarSubmitButton(props: { text: string }) {
  const { text } = props;

  const appContext = useContext(AppContext);
  const generatePictureDrawerContext = useContext(GeneratePictureDrawerContext);
  const generateAvatarContext = useContext(GenerateAvatarContext);

  const generateAvatars = useGenerateAvatar();
  const generateCustomPicture = useGenerateCustomPicture();

  const handleSubmit = () => {
    window.scrollTo(0, 0);
    generatePictureDrawerContext.closeDrawer();

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

function FormFooter() {
  const generatePictureDrawerContext = useContext(GeneratePictureDrawerContext);

  return (
    <DrawerFooter>
      <button
        onClick={generatePictureDrawerContext.closeDrawer}
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
  const generatePictureDrawerContext = useContext(GeneratePictureDrawerContext);

  const generateAvatars = useGenerateAvatar();
  const generateCustomPicture = useGenerateCustomPicture();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    window.scrollTo(0, 0);
    generatePictureDrawerContext.closeDrawer();

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

function GeneratePictureDrawer() {
  const generatePictureDrawerContext = useContext(GeneratePictureDrawerContext);

  return (
    <Drawer
      isOpen={generatePictureDrawerContext.isOpen}
      onClose={generatePictureDrawerContext.closeDrawer}
      position="left"
    >
      <GenerateAvatarProvider>
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
      </GenerateAvatarProvider>
    </Drawer>
  );
}

function GeneratePictureNavItem() {
  const appContext = useContext(AppContext);
  const generatePictureDrawerContext = useContext(GeneratePictureDrawerContext);

  if (appContext.state.avatars.isLoading) {
    return (
      <Fragment>
        <li className="opacity-50 hidden md:flex">
          <a role="button">
            Generate Picture <Spinner />
          </a>
        </li>
        <li className="opacity-50 md:hidden">
          <a role="button">
            Generating <Spinner />
          </a>
        </li>
      </Fragment>
    );
  }

  return (
    <li onClick={generatePictureDrawerContext.openDrawer}>
      <a role="button">Generate Picture</a>
    </li>
  );
}

function UploadPictureNavItem() {
  const appContext = useContext(AppContext);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFileInput = () => fileInputRef.current?.click();

  const uploadFiles = useUploadFiles();

  const onFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    uploadFiles(e.target.files);
  };

  if (appContext.state.upload.isLoading) {
    return (
      <Fragment>
        <li className="opacity-50 hidden md:flex">
          <a role="button">
            Upload Picture <Spinner />
          </a>
        </li>
        <li className="opacity-50 md:hidden">
          <a role="button">
            Uploading <Spinner />
          </a>
        </li>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <input
        hidden
        onChange={onFileInputChange}
        ref={fileInputRef}
        type="file"
      />

      <li onClick={openFileInput}>
        <a role="button">Upload Picture</a>
      </li>
    </Fragment>
  );
}

export function Nav(props: React.ComponentPropsWithoutRef<'div'>) {
  const { user } = useUser();

  return (
    <AddCreditsDrawerProvider>
      <GeneratePictureDrawerProvider>
        <div className="navbar bg-base-200 flex fixed top-0 w-100" {...props}>
          <div className="flex-1">
            <Link
              href={!user ? '/' : '/account'}
              className="btn btn-ghost normal-case text-xl hidden lg:flex"
            >
              AI Portrait Studio
            </Link>

            {user && (
              <div className="flex-none gap-2">
                <ul className="menu menu-horizontal px-1">
                  <GeneratePictureNavItem />
                  <UploadPictureNavItem />
                </ul>
              </div>
            )}
          </div>

          <div className="flex-none gap-2">
            <ul className="menu menu-horizontal px-1">
              <NavMenu />
              <NavMenuDropDown />
            </ul>
          </div>
        </div>

        <AddCreditsDrawer />
        <GeneratePictureDrawer />
      </GeneratePictureDrawerProvider>
    </AddCreditsDrawerProvider>
  );
}
