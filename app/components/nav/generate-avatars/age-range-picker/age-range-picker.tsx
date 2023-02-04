interface AgeRangePickerProps {
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: number;
}

export function AgeRangePicker(props: AgeRangePickerProps) {
  const { value, onChange, isLoading } = props;

  return (
    <div className="form-control ">
      <label
        htmlFor="age"
        className="cursor-pointer items-start gap-3 flex flex-col"
      >
        <span className="label-text whitespace-nowrap">Age ({value})</span>
        <input
          className="range range-primary"
          disabled={isLoading}
          id="age"
          max="100"
          min="1"
          onChange={onChange}
          type="range"
          value={value}
        />
      </label>
    </div>
  );
}
