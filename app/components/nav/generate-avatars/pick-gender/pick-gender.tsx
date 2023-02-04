import { genders } from '@aa/utils/prompt';

interface PickGenderProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  value: (typeof genders)[number];
}

export function PickGender(props: PickGenderProps) {
  const { onChange, isLoading, value } = props;

  const renderGenderRadioButton = (gender: (typeof genders)[number]) => {
    return (
      <div className="form-control" key={gender}>
        <label className="label cursor-pointer flex gap-4">
          <span className="label-text capitalize">{gender}</span>
          <input
            onChange={onChange}
            value={gender}
            type="radio"
            disabled={isLoading}
            className="radio"
            checked={value === gender}
          />
        </label>
      </div>
    );
  };

  return <div className="flex">{genders.map(renderGenderRadioButton)}</div>;
}
