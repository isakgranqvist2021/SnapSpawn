import {
  useGenerateAvatarDispatch,
  useGenerateAvatarState,
} from '../generate-avatars.context';

export function AgeRangePicker() {
  const dispatch = useGenerateAvatarDispatch();
  const state = useGenerateAvatarState();

  const isLoading = state.isLoading;
  const value = state.form.age;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      age: parseInt(e.target.value),
      type: 'set:age',
    });
  };

  return (
    <div className="form-control">
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
