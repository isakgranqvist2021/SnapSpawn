import { Traits, traits } from '@aa/models';

interface PickTraitsProps {
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: Traits;
}

export function PickTraits(props: PickTraitsProps) {
  const { onChange, isLoading, value } = props;

  const renderTraitButton = (trait: Traits) => {
    return (
      <div className="form-control" key={trait}>
        <label className="label cursor-pointer flex gap-2">
          <span
            className={`label-text capitalize ${
              value === trait ? 'text-primary' : ''
            }`}
          >
            {trait}
          </span>
          <input
            onChange={onChange}
            value={trait}
            type="radio"
            disabled={isLoading}
            className="radio"
            checked={value === trait}
          />
        </label>
      </div>
    );
  };

  return (
    <div className="flex gap-2 flex-wrap">{traits.map(renderTraitButton)}</div>
  );
}
