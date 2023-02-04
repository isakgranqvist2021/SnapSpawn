interface AgeRangePickerProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
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
          type="range"
          min="1"
          max="100"
          disabled={isLoading}
          onChange={onChange}
          value={value}
          className="range"
          id="age"
        />
      </label>
    </div>
  );
}
