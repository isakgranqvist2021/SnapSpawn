import { useEffect, useState } from 'react';

function Menu(props: { isOpen: boolean }) {
  const { isOpen } = props;

  const themes = [
    'light',
    'dark',
    'dracula',
    'halloween',
    'cyberpunk',
    'corporate',
    'coffee',
  ];

  if (!isOpen) {
    return null;
  }

  const renderThemeButton = (theme: string) => {
    const setTheme = () => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    };

    return (
      <a
        role="button"
        key={theme}
        onClick={setTheme}
        className="btn btn-sm btn-secondary"
      >
        {theme}
      </a>
    );
  };

  return (
    <div className="absolute bottom-full mb-3 flex flex-col gap-3 right-full">
      {themes.map(renderThemeButton)}
    </div>
  );
}

export function ThemePicker() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, []);

  return (
    <button
      onClick={toggleIsOpen}
      className="btn btn-circle btn-accent fixed bottom-5 right-5"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <Menu isOpen={isOpen} />

        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
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
              d="M15 11.25l1.5 1.5.75-.75V8.758l2.276-.61a3 3 0 10-3.675-3.675l-.61 2.277H12l-.75.75 1.5 1.5M15 11.25l-8.47 8.47c-.34.34-.8.53-1.28.53s-.94.19-1.28.53l-.97.97-.75-.75.97-.97c.34-.34.53-.8.53-1.28s.19-.94.53-1.28L12.75 9M15 11.25L12.75 9"
            />
          </svg>
        )}
      </div>
    </button>
  );
}
