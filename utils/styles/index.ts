interface GetButtonClassNameOptions {
  textColor: string;
  hoverBgColor: string;
  bgColor: string;
  className?: string;
}

export function getButtonClassName(options: GetButtonClassNameOptions) {
  const { textColor, hoverBgColor, bgColor, className } = options;

  return [
    className,
    bgColor,
    textColor,
    `hover:${hoverBgColor}`,
    'flex items-center justify-center text-sm px-2 py-1 rounded disabled:opacity-20 disabled:pointer-events-none',
  ]
    .join(' ')
    .trim();
}
