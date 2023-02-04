import { Spinner } from '@aa/components/spinner';
import { useAppState } from '@aa/context';

interface GenerateAvatarSubmitButtonProps {
  isLoading: boolean;
}

export function GenerateAvatarSubmitButton(
  props: GenerateAvatarSubmitButtonProps,
) {
  const { isLoading } = props;
  const { credits } = useAppState();

  return (
    <button
      className="btn btn-secondary w-full"
      disabled={isLoading || credits === 0}
      type="submit"
    >
      {isLoading && (
        <div className="absolute z-10">
          <Spinner color="stroke-white" />
        </div>
      )}

      <span className={isLoading ? 'opacity-0' : ''}>
        {credits === 0 ? "You don't have enough credits" : 'Generate Avatar'}
      </span>
    </button>
  );
}
