import { AppContext, ContentSidebarContext } from '@aa/context';
import {
  useGenerateAvatar,
  useGenerateCustomPicture,
} from '@aa/hooks/use-generate-avatar';
import {
  Characteristic,
  Gender,
  GeneralAvatarModel,
  Traits,
  characteristics,
  genders,
  traits,
} from '@aa/models/prompt';
import Link from 'next/link';
import {
  Fragment,
  PropsWithChildren,
  Reducer,
  createContext,
  useContext,
  useReducer,
} from 'react';

import { Spinner } from './spinner';

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

function FormSection(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        columnGap: '1rem',
      }}
    >
      {children}
    </div>
  );
}

function PickGender() {
  const appContext = useContext(AppContext);
  const generateAvatarContext = useContext(GenerateAvatarContext);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    generateAvatarContext.dispatch({
      gender: e.target.value as Gender,
      type: 'set:gender',
    });
  };

  const renderGenderRadioButton = (gender: Gender) => {
    return (
      <div key={gender}>
        <label className="label cursor-pointer flex gap-4">
          <span
            className={`label-text capitalize ${
              generateAvatarContext.state.form.gender === gender
                ? 'text-primary'
                : ''
            }`}
          >
            {gender}
          </span>
          <input
            onChange={onChange}
            value={gender}
            type="radio"
            disabled={appContext.state.avatars.isLoading}
            className="radio"
            checked={generateAvatarContext.state.form.gender === gender}
          />
        </label>
      </div>
    );
  };

  return <Fragment>{genders.map(renderGenderRadioButton)}</Fragment>;
}

function PickTraits() {
  const appContext = useContext(AppContext);
  const generateAvatarContext = useContext(GenerateAvatarContext);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    generateAvatarContext.dispatch({
      traits: e.target.value as Traits,
      type: 'set:traits',
    });
  };

  const renderTraitButton = (trait: Traits) => {
    return (
      <div key={trait}>
        <label className="label cursor-pointer flex gap-2">
          <span
            className={`label-text capitalize ${
              generateAvatarContext.state.form.traits === trait
                ? 'text-primary'
                : ''
            }`}
          >
            {trait}
          </span>
          <input
            onChange={onChange}
            value={trait}
            type="radio"
            disabled={appContext.state.avatars.isLoading}
            className="radio"
            checked={generateAvatarContext.state.form.traits === trait}
          />
        </label>
      </div>
    );
  };

  return <Fragment>{traits.map(renderTraitButton)}</Fragment>;
}

function PickCharacteristics() {
  const appContext = useContext(AppContext);
  const generateAvatarContext = useContext(GenerateAvatarContext);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    generateAvatarContext.dispatch({
      characteristics: e.target.value as Characteristic,
      type: 'set:characteristics',
    });
  };

  const renderCharacteristicButton = (characteristic: Characteristic) => {
    const isChecked =
      generateAvatarContext.state.form.characteristics === characteristic;

    return (
      <div className="form-control" key={characteristic}>
        <label className="label cursor-pointer gap-2">
          <span
            className={`label-text capitalize ${
              isChecked ? 'text-primary' : ''
            }`}
          >
            {characteristic}
          </span>
          <input
            disabled={appContext.state.avatars.isLoading}
            onChange={onChange}
            value={characteristic}
            type="radio"
            className="radio"
            checked={isChecked}
          />
        </label>
      </div>
    );
  };

  return <Fragment>{characteristics.map(renderCharacteristicButton)}</Fragment>;
}

function GenerateAvatarSubmitButton(props: { text: string }) {
  const { text } = props;

  const appContext = useContext(AppContext);
  const contentSidebarContext = useContext(ContentSidebarContext);
  const generateAvatarContext = useContext(GenerateAvatarContext);

  const generateAvatars = useGenerateAvatar();
  const generateCustomPicture = useGenerateCustomPicture();

  const handleSubmit = () => {
    window.scrollTo(0, 0);
    contentSidebarContext.setIsOpen(false);

    generateAvatarContext.state.mode === 'generate'
      ? generateAvatars(generateAvatarContext.state.form)
      : generateCustomPicture(generateAvatarContext.state.customPrompt!);
  };

  if (appContext.state.credits.data === 0) {
    return (
      <Link href="/refill" className="btn btn-secondary">
        {text}
      </Link>
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
        <Link href="/refill">
          You have <span className="text-secondary">0</span> credits
        </Link>
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
      <FormSection>
        <PickGender />
      </FormSection>

      <div className="divider my-0">Pick Accessory</div>

      <FormSection>
        <PickTraits />
      </FormSection>

      <div className="divider my-0">Pick Theme</div>

      <FormSection>
        <PickCharacteristics />
      </FormSection>
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
  const contentSidebarContext = useContext(ContentSidebarContext);

  const closeContentSidebar = () => contentSidebarContext.setIsOpen(false);

  return (
    <div className="flex gap-3 p-5 justify-center bg-base-200">
      <button
        onClick={closeContentSidebar}
        type="button"
        className="btn btn-outline btn-error"
      >
        Cancel
      </button>

      <GenerateAvatarSubmitButton text="Generate" />
    </div>
  );
}

function Form() {
  const generateAvatarContext = useContext(GenerateAvatarContext);
  const contentSidebarContext = useContext(ContentSidebarContext);

  const generateAvatars = useGenerateAvatar();
  const generateCustomPicture = useGenerateCustomPicture();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    window.scrollTo(0, 0);
    contentSidebarContext.setIsOpen(false);

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
    <div className="flex gap-3">
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
  const contentSidebarContext = useContext(ContentSidebarContext);

  const closeContentSidebar = () => contentSidebarContext.setIsOpen(false);

  return (
    <div>
      <div
        onClick={closeContentSidebar}
        className={
          contentSidebarContext.isOpen
            ? 'fixed inset-0 z-10 ease-in-out transition-all duration-200'
            : 'fixed inset-0 z-10 ease-in-out transition-all duration-200 pointer-events-none'
        }
        style={
          contentSidebarContext.isOpen
            ? {
                backgroundColor: 'rgba(0,0,0,0.7)',
              }
            : undefined
        }
      ></div>

      <div
        className={
          contentSidebarContext.isOpen
            ? 'fixed top-0 left-0 bg-base-100 h-screen flex flex-col justify-between overflow-hidden ease-in-out transition-all duration-200 z-20 w-96'
            : 'fixed top-0 left-0 bg-base-100 h-screen flex flex-col justify-between overflow-hidden ease-in-out transition-all duration-200 z-20 w-0'
        }
      >
        <div className="flex flex-col gap-5 overflow-auto p-5 w-96">
          <a
            className="link link-primary text-center"
            target="_blank"
            rel="noreferrer"
            href="/The-DALL·E-2-prompt-book-v1.02.pdf"
          >
            The Dall-E prompt Book
          </a>

          <TabHeader />

          <UserCreditsText />

          <Form />
        </div>

        <FormFooter />
      </div>
    </div>
  );
}

export function GenerateAvatarsForm() {
  return (
    <GenerateAvatarProvider>
      <GenerateAvatarsFormContent />
    </GenerateAvatarProvider>
  );
}
