const generateSelectOptions = (options: Array<String>) => {
  return options.map((option) => {
    const value = option.toString();
    return (
      <option value={value} key={value}>
        {option}
      </option>
    );
  });
};

export default function FormSelect(
  options: Array<string>,
  name: string,
  value: string,
  onChange: (event: any) => void,
  tabIndex: number
) {
  return (
    <select tabIndex={tabIndex} name={name} value={value} onChange={onChange}>
      {generateSelectOptions(options)}
    </select>
  );
}
