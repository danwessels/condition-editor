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
const primaryColor = "#3b82f6"; // blue-500

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

  const customStyles = {
    control: (
      provided: Record<string, unknown>,
      state: { isFocused: boolean },
    ) => ({
      ...provided,
      backgroundColor: "#27272a", // zinc-800
      borderColor: state.isFocused ? primaryColor : "#52525b", // blue-500 : zinc-600
      borderWidth: "1px",
      borderRadius: "0.375rem", // rounded-md
      boxShadow: state.isFocused ? `0 0 0 1px ${primaryColor}` : "none", // blue-500 ring
      color: "#f4f4f5", // zinc-100
      "&:hover": {
        borderColor: state.isFocused ? primaryColor : "#71717a", // blue-500 : zinc-500
      },
    }),
    menu: (provided: Record<string, unknown>) => ({
      ...provided,
      backgroundColor: "#27272a", // zinc-800
      border: "1px solid #52525b", // zinc-600
      borderRadius: "0.375rem",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    }),
    option: (
      provided: Record<string, unknown>,
      state: { isSelected: boolean; isFocused: boolean },
    ) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? primaryColor // blue-500
        : state.isFocused
          ? "#3f3f46" // zinc-700
          : "transparent",
      color: state.isSelected ? "#ffffff" : "#f4f4f5", // white : zinc-100
      "&:hover": {
        backgroundColor: state.isSelected ? primaryColor : "#3f3f46", // blue-500 : zinc-700
      },
    }),
    singleValue: (provided: Record<string, unknown>) => ({
      ...provided,
      color: "#f4f4f5", // zinc-100
    }),
    multiValue: (provided: Record<string, unknown>) => ({
      ...provided,
      backgroundColor: "#60a5fa", // blue-500
      borderRadius: "0.25rem",
    }),
    multiValueLabel: (provided: Record<string, unknown>) => ({
      ...provided,
      color: "black",
      fontSize: "0.875rem",
    }),
    multiValueRemove: (provided: Record<string, unknown>) => ({
      ...provided,
      color: "black",
      "&:hover": {
        backgroundColor: "#2563eb", // blue-600
        color: "#ffffff",
      },
    }),
    placeholder: (provided: Record<string, unknown>) => ({
      ...provided,
      color: "#a1a1aa", // zinc-400
    }),
    input: (provided: Record<string, unknown>) => ({
      ...provided,
      color: "#f4f4f5", // zinc-100
    }),
    indicatorSeparator: (provided: Record<string, unknown>) => ({
      ...provided,
      backgroundColor: "#52525b", // zinc-600
    }),
    dropdownIndicator: (provided: Record<string, unknown>) => ({
      ...provided,
      color: "#a1a1aa", // zinc-400
      "&:hover": {
        color: primaryColor, // blue-500
      },
    }),
    clearIndicator: (provided: Record<string, unknown>) => ({
      ...provided,
      color: "#a1a1aa", // zinc-400
      "&:hover": {
        color: "#ef4444", // red-500
      },
    }),
  };

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
        styles={customStyles}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: primaryColor, // blue-500
            primary75: "#60a5fa", // blue-400
            primary50: "#93c5fd", // blue-300
            primary25: "#bae6fd", // blue-200
          },
        })}
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
      styles={customStyles}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: primaryColor, // blue-500
          primary75: "#60a5fa", // blue-400
          primary50: "#93c5fd", // blue-300
          primary25: "#bae6fd", // blue-200
        },
      })}
    />
  );
}
