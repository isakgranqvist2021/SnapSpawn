import { Gender, genders } from '@aa/models';

interface PickGenderProps {
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: Gender;
}

export function PickGender(props: PickGenderProps) {
  const { onChange, isLoading, value } = props;

  const renderGenderRadioButton = (gender: Gender) => {
    return (
      <div className="form-control" key={gender}>
        <label className="label cursor-pointer flex gap-4">
          <span
            className={`label-text capitalize ${
              value === gender ? 'text-primary' : ''
            }`}
          >
            {gender}
          </span>
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

  return (
    <div className="flex gap-2 flex-wrap">
      {genders.map(renderGenderRadioButton)}
    </div>
  );
}
