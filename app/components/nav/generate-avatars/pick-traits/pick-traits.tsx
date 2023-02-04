import { Traits, traits } from '@aa/models';

interface PickTraitsProps {
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: Traits;
}

export function PickTraits(props: PickTraitsProps) {
  const { onChange, isLoading, value } = props;

  const rendertraitsButton = (Traits: Traits) => {
    return (
      <div className="form-control" key={Traits}>
        <label className="label cursor-pointer flex gap-2">
          <span className="label-text capitalize">{Traits}</span>
          <input
            onChange={onChange}
            value={Traits}
            type="radio"
            disabled={isLoading}
            className="radio"
            checked={value === Traits}
          />
        </label>
      </div>
    );
  };

  return (
    <div className="flex gap-2 flex-wrap">{traits.map(rendertraitsButton)}</div>
  );
}
