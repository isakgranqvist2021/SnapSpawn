import { Characteristic, Traits, characteristics, traits } from '@aa/models';

interface PickCharacteristicsProps {
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: Characteristic;
}

export function PickCharacteristics(props: PickCharacteristicsProps) {
  const { onChange, isLoading, value } = props;

  const renderCharacteristicButton = (characteristic: Characteristic) => {
    return (
      <div className="form-control" key={characteristic}>
        <label className="label cursor-pointer">
          <span
            className={`label-text capitalize ${
              value === characteristic ? 'text-primary' : ''
            }`}
          >
            {characteristic}
          </span>
          <input
            onChange={onChange}
            value={characteristic}
            type="radio"
            disabled={isLoading}
            className="radio"
            checked={value === characteristic}
          />
        </label>
      </div>
    );
  };

  return (
    <div className="grid gap-2 grid-cols-2">
      {characteristics.map(renderCharacteristicButton)}
    </div>
  );
}
