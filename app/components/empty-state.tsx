import Link from 'next/link';

export function EmptyState(props: {
  message: string;
  buttonText?: string;
  buttonHref?: string;
  buttonOnClick?: () => void;
}) {
  const { message, buttonText, buttonHref } = props;

  return (
    <div className="text-center p-5 bg-base-200 w-full flex flex-col gap-5 items-center h-60 justify-center">
      <h3 className="text-3xl">{message}</h3>

      {buttonHref && (
        <Link className="btn btn-primary" href={buttonHref}>
          {buttonText}
        </Link>
      )}

      {props.buttonOnClick && (
        <button className="btn btn-primary" onClick={props.buttonOnClick}>
          {buttonText}
        </button>
      )}
    </div>
  );
}
