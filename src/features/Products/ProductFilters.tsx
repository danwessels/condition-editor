import { useContext } from "react";
import { type MultiValue, type SingleValue } from "react-select";

import { Select } from "../../components";
import { type SelectOptionType, type PropertyType } from "../../types";
import { type OperatorOptionType } from "./reducer";
import { ProductContext } from "./context";

const operatorsByPropertyType = {
  string: ["equals", "any", "none", "in", "contains"],
  number: ["equals", "greater_than", "less_than", "any", "none", "in"],
  enumerated: ["equals", "any", "none", "in"],
};

function getOperatorOptions(selectedPropertyType?: PropertyType) {
  if (!selectedPropertyType) return [];
  const operators = window.datastore.getOperators();
  const validOperators = operatorsByPropertyType[selectedPropertyType];

  return operators
    .filter(({ id }) => validOperators.includes(id))
    .map(({ id, text }) => ({
      value: id,
      label: text,
    }));
}

function getValueOptions(selectedPropertyValues?: string[] | null) {
  if (!selectedPropertyValues || selectedPropertyValues?.length === 0)
    return [];

  return selectedPropertyValues.map((label) => ({
    value: label,
    label: label.slice(0, 1).toUpperCase() + label.slice(1),
  }));
}

function getPropertiesOptions() {
  const properties = window.datastore.getProperties();

  return properties.map(({ id, name }) => ({
    value: id.toString(),
    label: name,
  }));
}

export default function ProductFilters() {
  const [state, dispatch] = useContext(ProductContext);
  const allProperties = window.datastore.getProperties();

  const selectedProperty =
    state?.selectedProperty &&
    state.selectedProperty?.value !== undefined &&
    state.selectedProperty?.value !== null
      ? allProperties.find(
          (property) => property.id === parseInt(state.selectedProperty!.value),
        )
      : null;

  const propertyOptions = getPropertiesOptions();
  const operatorOptions = getOperatorOptions(selectedProperty?.type);
  const valueOptions = getValueOptions(selectedProperty?.values);

  function onSelectProperty(selected: SingleValue<SelectOptionType>) {
    dispatch({
      type: "update_property",
      value: selected,
    });
  }

  function onSelectOperator(selected: SingleValue<SelectOptionType>) {
    dispatch({
      type: "update_operator",
      value: selected as SingleValue<OperatorOptionType>,
    });
  }

  function onSelectValue(selected: MultiValue<SelectOptionType>) {
    dispatch({
      type: "update_values",
      value: selected,
    });
  }

  function onChangeInputValue(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch({
      type: "update_search_text",
      value: e.target.value,
    });
  }

  const getInputType = () => {
    if (selectedProperty?.type === "number") {
      return "number";
    }
    return "text";
  };

  const operatorsToHideInput = ["any", "none", undefined];
  const hideInput = operatorsToHideInput.includes(
    state.selectedOperator?.value,
  );
  const inputClass = `w-full border border-slate-300 rounded-sm px-2 ${hideInput ? "opacity-0" : ""}`;

  return (
    <div className="flex gap-2 mb-4">
      <Select
        options={propertyOptions}
        placeholder="Select property"
        onChange={onSelectProperty}
        key="property-select"
        value={state.selectedProperty}
      />
      <Select
        options={operatorOptions}
        placeholder="Select operator"
        onChange={onSelectOperator}
        key="operator-select"
        value={state.selectedOperator}
      />
      {state.selectedOperator?.value !== "in" && (
        <input
          type={getInputType()}
          placeholder="Enter value"
          className={inputClass}
          onChange={onChangeInputValue}
          key="value-input"
          value={state.searchText}
          disabled={hideInput}
        />
      )}
      {state.selectedOperator && state.selectedOperator?.value === "in" && (
        <Select
          options={valueOptions}
          placeholder={
            valueOptions?.length > 0
              ? "Select value(s)"
              : "Enter one or more values"
          }
          onChange={onSelectValue}
          isMulti={true}
          key="value-select"
          value={state.selectedValues}
          isCreatable={valueOptions?.length === 0} // Allow user to add options if is not enumerated and has no predefined values
        />
      )}
    </div>
  );
}
