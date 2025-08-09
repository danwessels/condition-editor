import Select, { type MultiValue, type SingleValue } from "react-select";
import CreatableSelect from "react-select/creatable";

type OptionType = { value: string; label: string };

interface BaseProps {
  options: OptionType[];
  placeholder?: string;
  isCreatable?: boolean;
}

interface MultiSelectProps extends BaseProps {
  isMulti: true;
  onChange: (selected: MultiValue<OptionType>) => void;
  value: MultiValue<OptionType>;
}

interface SingleSelectProps extends BaseProps {
  isMulti?: false;
  onChange: (selected: SingleValue<OptionType>) => void;
  value: SingleValue<OptionType>;
}

type SelectProps = MultiSelectProps | SingleSelectProps;

export default function CustomSelect({
  options,
  onChange,
  placeholder,
  isMulti = false,
  isCreatable = false,
  value,
}: SelectProps) {
  function handleChange(
    value: SingleValue<OptionType> | MultiValue<OptionType>,
  ) {
    if (isMulti) {
      (onChange as (selected: MultiValue<OptionType>) => void)(
        value as MultiValue<OptionType>,
      );
    } else {
      (onChange as (selected: SingleValue<OptionType>) => void)(
        value as SingleValue<OptionType>,
      );
    }
  }

  function handleCreate(inputValue: string) {
    const newOption = {
      label: inputValue,
      value: inputValue.toLowerCase().replace(" ", "_"),
    };

    if (isMulti && Array.isArray(value)) {
      handleChange([...value, newOption]);
    } else {
      handleChange(newOption);
    }
  }

  if (isCreatable) {
    return (
      <CreatableSelect
        options={options}
        isMulti={isMulti}
        placeholder={placeholder}
        className="w-full"
        onChange={handleChange}
        onCreateOption={handleCreate}
        value={value}
      />
    );
  }

  return (
    <Select
      options={options}
      isMulti={isMulti}
      placeholder={placeholder}
      className="w-full"
      onChange={handleChange}
      value={value}
    />
  );
}
