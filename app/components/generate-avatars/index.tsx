import { AppContext, ContentSidebarContext } from '@aa/context';
import {
  AvatarModel,
  Characteristic,
  Gender,
  PromptModel,
  Size,
  Traits,
  characteristics,
  genders,
  traits,
} from '@aa/models';
import Link from 'next/link';
import React, {
  PropsWithChildren,
  Reducer,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from 'react';

import { Spinner } from '../spinner';

type GenerateAvatarApiResponse =
  | {
      avatars: AvatarModel[];
    }
  | undefined;

type GenerateAvatarMode = 'custom' | 'generate';

type ReducerAction =
  | { isLoading: boolean; type: 'set:isLoading' }
  | { age: number; type: 'set:age' }
  | { traits: Traits; type: 'set:traits' }
  | { gender: Gender; type: 'set:gender' }
  | { characteristics: Characteristic; type: 'set:characteristics' }
  | { type: 'set:result'; result: string[] }
  | { type: 'clear:result' }
  | { type: 'toggle:custom-prompt' }
  | { type: 'set:custom-prompt'; customPrompt: string }
  | { type: 'set:size'; size: Size }
  | { type: 'set:n'; n: number }
  | { type: 'set:mode'; mode: GenerateAvatarMode };

const DEFAULT_FORM_STATE: PromptModel = {
  characteristics: 'afrofuturism',
  gender: 'female',
  traits: 'beard',
};

interface GenerateAvatarState {
  customPrompt: string | null;
  form: PromptModel;
  mode: GenerateAvatarMode;
  n: number;
  result: string[] | null;
  size: Size;
}

interface GenerateAvatarContextType {
  dispatch: React.Dispatch<ReducerAction>;
  state: GenerateAvatarState;
}

const INITIAL_STATE: GenerateAvatarState = {
  customPrompt: null,
  form: DEFAULT_FORM_STATE,
  mode: 'generate',
  n: 1,
  result: null,
  size: '1024x1024',
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

    case 'set:result':
      return { ...state, result: [...action.result, ...(state.result ?? [])] };

    case 'clear:result':
      return { ...state, result: null };

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

    case 'set:size':
      return { ...state, size: action.size };

    case 'set:n':
      return { ...state, n: action.n };

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

function useGenerateAvatar() {
  const { methods } = useContext(AppContext);

  const { setIsOpen } = useContext(ContentSidebarContext);

  const {
    dispatch,
    state: { customPrompt, form, mode, n, size },
  } = useContext(GenerateAvatarContext);

  return useCallback(async () => {
    setIsOpen(false);

    let res: AvatarModel[] | null = null;

    if (mode === 'custom') {
      res = await methods.generateCustomPicture(customPrompt!, size, n);
    } else {
      res = await methods.generateAvatars(form, size, n);
    }

    if (res) {
      const urls = res.map((avatar: AvatarModel) => avatar.url);
      dispatch({ result: urls, type: 'set:result' });
    }
  }, [methods, dispatch, customPrompt, form, mode, n, size, setIsOpen]);
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
  const { state } = useContext(AppContext);

  const {
    dispatch,
    state: { form },
  } = useContext(GenerateAvatarContext);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ gender: e.target.value as Gender, type: 'set:gender' });
  };

  const renderGenderRadioButton = (gender: Gender) => {
    return (
      <div key={gender}>
        <label className="label cursor-pointer flex gap-4">
          <span
            className={`label-text capitalize ${
              form.gender === gender ? 'text-primary' : ''
            }`}
          >
            {gender}
          </span>
          <input
            onChange={onChange}
            value={gender}
            type="radio"
            disabled={state.avatars.isLoading}
            className="radio"
            checked={form.gender === gender}
          />
        </label>
      </div>
    );
  };

  return (
    <React.Fragment>{genders.map(renderGenderRadioButton)}</React.Fragment>
  );
}

function PickTraits() {
  const { state } = useContext(AppContext);

  const {
    dispatch,
    state: { form },
  } = useContext(GenerateAvatarContext);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
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
              form.traits === trait ? 'text-primary' : ''
            }`}
          >
            {trait}
          </span>
          <input
            onChange={onChange}
            value={trait}
            type="radio"
            disabled={state.avatars.isLoading}
            className="radio"
            checked={form.traits === trait}
          />
        </label>
      </div>
    );
  };

  return <React.Fragment>{traits.map(renderTraitButton)}</React.Fragment>;
}

function PickCharacteristics() {
  const { state } = useContext(AppContext);

  const {
    dispatch,
    state: { form },
  } = useContext(GenerateAvatarContext);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      characteristics: e.target.value as Characteristic,
      type: 'set:characteristics',
    });
  };

  const renderCharacteristicButton = (characteristic: Characteristic) => {
    const isChecked = form.characteristics === characteristic;

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
            disabled={state.avatars.isLoading}
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

  return (
    <React.Fragment>
      {characteristics.map(renderCharacteristicButton)}
    </React.Fragment>
  );
}

function GenerateAvatarSubmitButton(props: { text: string }) {
  const { text } = props;

  const { state } = useContext(AppContext);

  const credits = state.credits.data;
  const isLoading = state.avatars.isLoading;

  const generateAvatars = useGenerateAvatar();

  if (credits === 0) {
    return (
      <Link href="/refill" className="btn btn-secondary">
        0 Credits. Add some now!
      </Link>
    );
  }

  return (
    <button
      className="btn btn-secondary relative"
      disabled={isLoading}
      onClick={generateAvatars}
      type="submit"
    >
      {isLoading && (
        <div className="absolute z-10">
          <Spinner color="stroke-white" />
        </div>
      )}

      <span className={isLoading ? 'opacity-0' : ''}>{text}</span>
    </button>
  );
}

function UserCreditsText() {
  const { state } = useContext(AppContext);

  if (!state.credits.data) {
    return (
      <h1 className="text-2xl mt-3 text-center">
        You have <span className="text-secondary">0</span> credits
        <Link className="ml-2 text-secondary" href="/refill">
          add some now!
        </Link>
      </h1>
    );
  }

  return (
    <h1 className="text-2xl text-center">
      You have <span className="text-secondary">{state.credits.data}</span>{' '}
      credits
    </h1>
  );
}

function CustomPromptTextarea() {
  const { state } = useContext(AppContext);

  const {
    dispatch,
    state: { customPrompt },
  } = useContext(GenerateAvatarContext);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: 'set:custom-prompt', customPrompt: e.target.value });
  };

  return (
    <textarea
      className="textarea textarea-bordered h-24 resize w-full"
      disabled={state.avatars.isLoading}
      onChange={onChange}
      placeholder="Enter custom prompt here"
      value={customPrompt ?? ''}
    ></textarea>
  );
}

function GenerateFromPreDefinedOptionsForm() {
  return (
    <React.Fragment>
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
    </React.Fragment>
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
  const { setIsOpen } = useContext(ContentSidebarContext);

  const closeContentSidebar = () => setIsOpen(false);

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
  const {
    state: { mode },
  } = useContext(GenerateAvatarContext);

  const generateAvatars = useGenerateAvatar();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    generateAvatars();
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      {mode === 'generate' ? (
        <GenerateFromPreDefinedOptionsForm />
      ) : (
        <CustomPromptForm />
      )}
    </form>
  );
}

function TabHeader() {
  const {
    dispatch,
    state: { mode },
  } = useContext(GenerateAvatarContext);

  const setModeAsCustom = () => {
    dispatch({ type: 'set:mode', mode: 'custom' });
  };

  const setModeAsGenerate = () => {
    dispatch({ type: 'set:mode', mode: 'generate' });
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        className={
          mode === 'generate' ? 'btn btn-sm btn-outline' : 'btn btn-sm'
        }
        onClick={setModeAsGenerate}
      >
        Pre Defined Prompts
      </button>
      <button
        className={mode === 'custom' ? 'btn btn-sm btn-outline' : 'btn btn-sm'}
        onClick={setModeAsCustom}
      >
        Custom Prompt
      </button>
    </div>
  );
}

function GenerateAvatarsFormContent() {
  const { isOpen } = useContext(ContentSidebarContext);

  const getDrawerClassName = () => {
    const className = [
      'fixed top-0 left-0 bg-base-100 h-screen flex flex-col justify-between overflow-hidden ease-in-out transition-all duration-200',
    ];

    if (isOpen) {
      className.push('w-96');
    } else {
      className.push('w-0');
    }

    return className.join(' ');
  };

  return (
    <div>
      <div className={getDrawerClassName()}>
        <div className="flex flex-col gap-5 overflow-auto p-5 w-96">
          <a
            className="link link-primary"
            target="_blank"
            rel="noreferrer"
            href="/The-DALL·E-2-prompt-book-v1.02.pdf"
          >
            The Dall-E prompt Book
          </a>

          <UserCreditsText />

          <TabHeader />

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
