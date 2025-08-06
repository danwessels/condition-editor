import Select, { type MultiValue, type SingleValue } from "react-select";

type OptionType = { value: string; label: string };
type newValue = SingleValue<OptionType> | MultiValue<OptionType>;

interface SelectProps {
  options: OptionType[];
  placeholder?: string;
  onChange: (selected: newValue) => void;
  isMulti?: boolean;
}

export default function CustomSelect({
  options,
  onChange,
  placeholder,
  isMulti = false,
}: SelectProps) {
  return (
    <Select
      options={options}
      isMulti={isMulti}
      placeholder={placeholder}
      className="w-full"
      onChange={onChange}
    />
  );
}
