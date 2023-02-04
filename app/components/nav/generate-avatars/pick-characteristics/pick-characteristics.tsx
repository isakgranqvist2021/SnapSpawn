import { characteristics } from '@aa/utils/prompt';

interface PickCharacteristicsProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  value: (typeof characteristics)[number];
}

export function PickCharacteristics(props: PickCharacteristicsProps) {
  const { onChange, isLoading, value } = props;

  const renderCharacteristicsButton = (
    characteristic: (typeof characteristics)[number],
  ) => {
    return (
      <div className="form-control" key={characteristic}>
        <label className="label cursor-pointer flex gap-4">
          <span className="label-text capitalize">{characteristic}</span>
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
    <div className="flex flex-wrap">
      {characteristics.map(renderCharacteristicsButton)}
    </div>
  );
}
